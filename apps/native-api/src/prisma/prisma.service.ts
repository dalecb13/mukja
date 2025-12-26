import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private queryLogBuffer: Array<{
    query: string;
    params: any;
    executionTime: number;
    model?: string;
    operation?: string;
    userId?: string;
    route?: string;
    success?: boolean;
    errorMessage?: string;
  }> = [];
  private readonly QUERY_LOG_THRESHOLD_MS = 100; // Log queries slower than 100ms
  private readonly SLOW_QUERY_THRESHOLD_MS = 500; // Flag queries slower than 500ms as performance bottlenecks
  private flushTimeout: NodeJS.Timeout | null = null;
  private currentRequestContext?: { userId?: string; route?: string };
  private isLoggingEnabled = true;
  private metricsService: any; // Will be injected after initialization to avoid circular dependency

  constructor() {
    super();
    this.setupQueryLogging();
  }

  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Set MetricsService for performance bottleneck logging (called after initialization)
   */
  setMetricsService(metricsService: any) {
    this.metricsService = metricsService;
  }

  async onModuleDestroy() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }
    await this.flushQueryLogs();
    await this.$disconnect();
  }

  /**
   * Set request context for query logging (user ID and route)
   */
  setRequestContext(context: { userId?: string; route?: string }) {
    this.currentRequestContext = context;
  }

  /**
   * Clear request context
   */
  clearRequestContext() {
    this.currentRequestContext = undefined;
  }

  /**
   * Setup Prisma middleware for query logging
   */
  private setupQueryLogging() {
    // Skip if logging is disabled or this is a query log write itself
    if (!this.isLoggingEnabled) return;

    this.$use(async (params, next) => {
      // Skip logging queries to the query log table itself to prevent infinite loops
      if (params.model === 'DatabaseQueryLog') {
        return next(params);
      }

      const startTime = Date.now();
      let success = true;
      let errorMessage: string | undefined;

      try {
        const result = await next(params);
        return result;
      } catch (error) {
        success = false;
        errorMessage = error instanceof Error ? error.message : String(error);
        throw error;
      } finally {
        const executionTime = Date.now() - startTime;

        // Only log queries that exceed threshold or failed
        if (executionTime >= this.QUERY_LOG_THRESHOLD_MS || !success) {
          this.bufferQueryLog({
            query: this.sanitizeQuery(params),
            params: this.sanitizeParams(params.args),
            executionTime,
            model: params.model,
            operation: params.action,
            success,
            errorMessage,
          });
        }

        // Log performance bottleneck for slow queries
        if (executionTime >= this.SLOW_QUERY_THRESHOLD_MS && this.metricsService) {
          this.metricsService
            .logPerformanceBottleneck({
              type: 'slow_query',
              severity: executionTime >= 2000 ? 'critical' : 'warning',
              threshold: this.SLOW_QUERY_THRESHOLD_MS,
              actualValue: executionTime,
              resource: params.model ? `${params.model}.${params.action}` : params.action,
              details: {
                model: params.model,
                operation: params.action,
                query: this.sanitizeQuery(params),
              },
              userId: this.currentRequestContext?.userId,
            })
            .catch(() => {
              // Silently fail to prevent bottleneck logging failures
            });
        }
      }
    });
  }

  /**
   * Buffer query logs for batch insertion
   */
  private bufferQueryLog(log: {
    query: string;
    params: any;
    executionTime: number;
    model?: string;
    operation?: string;
    success?: boolean;
    errorMessage?: string;
  }) {
    this.queryLogBuffer.push({
      ...log,
      userId: this.currentRequestContext?.userId,
      route: this.currentRequestContext?.route,
    });

    // Flush if buffer is getting large
    if (this.queryLogBuffer.length >= 50) {
      this.flushQueryLogs();
    } else if (!this.flushTimeout) {
      // Flush after 5 seconds if no other flush is scheduled
      this.flushTimeout = setTimeout(() => {
        this.flushQueryLogs();
        this.flushTimeout = null;
      }, 5000);
    }
  }

  /**
   * Flush buffered query logs to database
   */
  async flushQueryLogs() {
    if (this.queryLogBuffer.length === 0) return;

    const logsToInsert = [...this.queryLogBuffer];
    this.queryLogBuffer = [];

    try {
      // Temporarily disable logging to prevent recursive logging
      const wasLoggingEnabled = this.isLoggingEnabled;
      this.isLoggingEnabled = false;

      // Access databaseQueryLog model directly (available after Prisma generate)
      const databaseQueryLog = (this as any).databaseQueryLog;
      if (!databaseQueryLog) {
        // Model not available yet, skip logging
        this.isLoggingEnabled = wasLoggingEnabled;
        return;
      }

      await Promise.all(
        logsToInsert.map((log) =>
          databaseQueryLog
            .create({
              data: {
                query: log.query,
                params: log.params ? (log.params as Prisma.InputJsonValue) : null,
                executionTime: log.executionTime,
                model: log.model || null,
                operation: log.operation || null,
                userId: log.userId || null,
                route: log.route || null,
                success: log.success !== false,
                errorMessage: log.errorMessage || null,
              },
            })
            .catch((err: any) => {
              // Silently fail to prevent logging failures from breaking the app
              this.logger.debug('Failed to log database query', err);
            }),
        ),
      );

      // Re-enable logging
      this.isLoggingEnabled = wasLoggingEnabled;
    } catch (error) {
      // Don't log query logging failures to prevent infinite loops
      this.logger.debug('Failed to flush query logs', error);
      this.isLoggingEnabled = true; // Re-enable on error
    }
  }

  /**
   * Sanitize query for logging (remove sensitive data patterns)
   */
  private sanitizeQuery(params: any): string {
    const model = params.model || 'Unknown';
    const action = params.action || 'Unknown';
    return `${model}.${action}`;
  }

  /**
   * Sanitize parameters for logging (remove passwords, tokens, etc.)
   */
  private sanitizeParams(args: any): any {
    if (!args) return null;

    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'authorization'];
    const sanitized = JSON.parse(JSON.stringify(args));

    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      if (Array.isArray(obj)) return obj.map(sanitizeObject);

      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          result[key] = sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };

    return sanitizeObject(sanitized);
  }
}






