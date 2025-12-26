import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly SLOW_ENDPOINT_THRESHOLD_MS = 1000; // Log endpoints slower than 1s

  constructor(
    private readonly metricsService: MetricsService,
    private readonly prismaService: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = (request as any).user?.id;

    const startTime = Date.now();
    let requestSize = 0;
    let responseSize = 0;

    // Calculate request size
    if (request.body) {
      requestSize = Buffer.byteLength(JSON.stringify(request.body), 'utf8');
    }

    // Set request context for Prisma query logging
    this.prismaService.setRequestContext({
      userId,
      route: url,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const latencyMs = Date.now() - startTime;

          // Calculate response size
          if (data) {
            try {
              responseSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
            } catch (e) {
              // If serialization fails, estimate or skip
              responseSize = 0;
            }
          }

          // Log API request
          this.logApiRequest({
            route: url,
            method,
            status: response.statusCode,
            latencyMs,
            requestSize,
            responseSize,
            userId,
            ipAddress: ip,
            userAgent,
          });

          // Check for slow endpoints (performance bottleneck)
          if (latencyMs >= this.SLOW_ENDPOINT_THRESHOLD_MS) {
            this.logPerformanceBottleneck({
              type: 'slow_endpoint',
              severity: latencyMs >= 5000 ? 'critical' : 'warning',
              threshold: this.SLOW_ENDPOINT_THRESHOLD_MS,
              actualValue: latencyMs,
              resource: `${method} ${url}`,
              details: {
                route: url,
                method,
                latencyMs,
                requestSize,
                responseSize,
              },
              userId,
            });
          }
        },
        error: (error) => {
          const latencyMs = Date.now() - startTime;

          // Log failed request
          this.logApiRequest({
            route: url,
            method,
            status: error.status || 500,
            latencyMs,
            requestSize,
            responseSize: 0,
            userId,
            ipAddress: ip,
            userAgent,
          }).catch(() => {
            // Silently fail to prevent error logging failures
          });
        },
        finalize: () => {
          // Clear request context
          this.prismaService.clearRequestContext();
        },
      }),
    );
  }

  private async logApiRequest(data: {
    route: string;
    method: string;
    status: number;
    latencyMs: number;
    requestSize?: number;
    responseSize?: number;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.metricsService.logApiRequest(data);
    } catch (error) {
      // Silently fail to prevent error logging failures from breaking requests
      this.logger.debug('Failed to log API request', error);
    }
  }

  private async logPerformanceBottleneck(data: {
    type: string;
    severity: 'warning' | 'critical';
    threshold: number;
    actualValue: number;
    resource?: string;
    details?: any;
    userId?: string;
  }) {
    try {
      await this.metricsService.logPerformanceBottleneck(data);
    } catch (error) {
      // Silently fail to prevent bottleneck logging failures
      this.logger.debug('Failed to log performance bottleneck', error);
    }
  }
}

