import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  EventDto,
  CreateMatchStatsDto,
  CreateAdImpressionDto,
  CreateCostDto,
  CreateRevenueDto,
  CreateErrorLogDto,
  UpdateErrorLogDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ingest multiple events with idempotency support
   */
  async ingestEvents(events: EventDto[], defaultUserId?: string) {
    const results = await Promise.allSettled(
      events.map(async (event) => {
        const userId = event.userId || defaultUserId;

        // Handle idempotency - upsert if key provided
        if (event.idempotencyKey) {
          try {
            return await this.prisma.event.upsert({
              where: { idempotencyKey: event.idempotencyKey },
              update: {}, // No update on conflict - just return existing
              create: {
                userId,
                sessionId: event.sessionId,
                eventType: event.eventType,
                properties: event.properties as Prisma.InputJsonValue,
                source: event.source || 'native-app',
                idempotencyKey: event.idempotencyKey,
              },
            });
          } catch (error) {
            // Handle race condition where upsert fails
            const prismaError = error as Prisma.PrismaClientKnownRequestError;
            if (prismaError?.code === 'P2002') {
              this.logger.debug(`Duplicate event skipped: ${event.idempotencyKey}`);
              return { skipped: true, idempotencyKey: event.idempotencyKey };
            }
            throw error;
          }
        }

        // No idempotency key - just insert
        return await this.prisma.event.create({
          data: {
            userId,
            sessionId: event.sessionId,
            eventType: event.eventType,
            properties: event.properties as Prisma.InputJsonValue,
            source: event.source || 'native-app',
          },
        });
      }),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    if (failed > 0) {
      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => r.reason?.message || 'Unknown error');
      this.logger.warn(`Event ingestion: ${succeeded} succeeded, ${failed} failed`, errors);
    }

    return { succeeded, failed, total: events.length };
  }

  /**
   * Create or update match stats (upsert on matchId)
   */
  async upsertMatchStats(dto: CreateMatchStatsDto) {
    return await this.prisma.matchStats.upsert({
      where: { matchId: dto.matchId },
      update: {
        mode: dto.mode,
        voteRule: dto.voteRule,
        participants: dto.participants,
        cardsPresented: dto.cardsPresented,
        cardsLiked: dto.cardsLiked,
        timeToDecisionSeconds: dto.timeToDecisionSeconds,
        resultRestaurantId: dto.resultRestaurantId,
        completed: dto.completed,
        completedAt: dto.completed ? new Date() : null,
      },
      create: {
        matchId: dto.matchId,
        mode: dto.mode,
        voteRule: dto.voteRule,
        participants: dto.participants,
        cardsPresented: dto.cardsPresented,
        cardsLiked: dto.cardsLiked,
        timeToDecisionSeconds: dto.timeToDecisionSeconds,
        resultRestaurantId: dto.resultRestaurantId,
        completed: dto.completed,
        completedAt: dto.completed ? new Date() : null,
      },
    });
  }

  /**
   * Record an ad impression
   */
  async createAdImpression(dto: CreateAdImpressionDto, defaultUserId?: string) {
    const userId = dto.userId || defaultUserId;
    if (!userId) {
      throw new ConflictException('User ID is required for ad impressions');
    }

    return await this.prisma.adImpression.create({
      data: {
        userId,
        placement: dto.placement,
        provider: dto.provider,
        watchedMs: dto.watchedMs,
        completed: dto.completed,
      },
    });
  }

  /**
   * Record external service cost (admin only)
   */
  async createCost(dto: CreateCostDto) {
    return await this.prisma.costExternal.create({
      data: {
        service: dto.service,
        unit: dto.unit,
        quantity: new Prisma.Decimal(dto.quantity),
        unitCost: new Prisma.Decimal(dto.unitCost),
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        notes: dto.notes,
      },
    });
  }

  /**
   * Record revenue entry (admin only or via webhook)
   */
  async createRevenue(dto: CreateRevenueDto) {
    return await this.prisma.revenue.create({
      data: {
        userId: dto.userId,
        source: dto.source,
        plan: dto.plan,
        amountGross: new Prisma.Decimal(dto.amountGross),
        fees: new Prisma.Decimal(dto.fees),
        amountNet: new Prisma.Decimal(dto.amountNet),
        periodStart: dto.periodStart ? new Date(dto.periodStart) : null,
        periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : null,
        externalRef: dto.externalRef,
      },
    });
  }

  /**
   * Log an API request (for observability)
   */
  async logApiRequest(data: {
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
    return await this.prisma.apiRequestLog.create({
      data: {
        route: data.route,
        method: data.method,
        status: data.status,
        latencyMs: data.latencyMs,
        requestSize: data.requestSize || null,
        responseSize: data.responseSize || null,
        userId: data.userId || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  }

  /**
   * Log a performance bottleneck
   */
  async logPerformanceBottleneck(data: {
    type: string;
    severity?: 'warning' | 'critical';
    threshold: number;
    actualValue: number;
    resource?: string;
    details?: Record<string, unknown>;
    userId?: string;
  }) {
    return await this.prisma.performanceBottleneckLog.create({
      data: {
        type: data.type,
        severity: data.severity || 'warning',
        threshold: data.threshold,
        actualValue: data.actualValue,
        resource: data.resource || null,
        details: data.details ? (data.details as Prisma.InputJsonValue) : Prisma.JsonNull,
        userId: data.userId || null,
      },
    });
  }

  /**
   * Get database query logs with filtering
   */
  async getDatabaseQueryLogs(filters: {
    model?: string;
    operation?: string;
    minExecutionTime?: number;
    userId?: string;
    route?: string;
    success?: boolean;
    days?: number;
    limit?: number;
    offset?: number;
  } = {}) {
    const since = filters.days
      ? new Date(Date.now() - filters.days * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days

    const where: Prisma.DatabaseQueryLogWhereInput = {
      createdAt: { gte: since },
    };

    if (filters.model) where.model = filters.model;
    if (filters.operation) where.operation = filters.operation;
    if (filters.minExecutionTime) where.executionTime = { gte: filters.minExecutionTime };
    if (filters.userId) where.userId = filters.userId;
    if (filters.route) where.route = filters.route;
    if (filters.success !== undefined) where.success = filters.success;

    const [logs, total] = await Promise.all([
      this.prisma.databaseQueryLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 100,
        skip: filters.offset || 0,
      }),
      this.prisma.databaseQueryLog.count({ where }),
    ]);

    return {
      logs,
      total,
      limit: filters.limit || 100,
      offset: filters.offset || 0,
    };
  }

  /**
   * Get performance bottleneck logs with filtering
   */
  async getPerformanceBottleneckLogs(filters: {
    type?: string;
    severity?: string;
    resolved?: boolean;
    resource?: string;
    days?: number;
    limit?: number;
    offset?: number;
  } = {}) {
    const since = filters.days
      ? new Date(Date.now() - filters.days * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days

    const where: Prisma.PerformanceBottleneckLogWhereInput = {
      createdAt: { gte: since },
    };

    if (filters.type) where.type = filters.type;
    if (filters.severity) where.severity = filters.severity;
    if (filters.resolved !== undefined) where.resolved = filters.resolved;
    if (filters.resource) where.resource = filters.resource;

    const [logs, total] = await Promise.all([
      this.prisma.performanceBottleneckLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 100,
        skip: filters.offset || 0,
      }),
      this.prisma.performanceBottleneckLog.count({ where }),
    ]);

    return {
      logs,
      total,
      limit: filters.limit || 100,
      offset: filters.offset || 0,
    };
  }

  /**
   * Get performance statistics
   */
  async getPerformanceStats(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // API Request Stats
    const apiStats = await this.prisma.apiRequestLog.aggregate({
      where: { createdAt: { gte: since } },
      _avg: { latencyMs: true, requestSize: true, responseSize: true },
      _max: { latencyMs: true },
      _min: { latencyMs: true },
      _count: { id: true },
    });

    const slowApiRequests = await this.prisma.apiRequestLog.count({
      where: {
        createdAt: { gte: since },
        latencyMs: { gte: 1000 },
      },
    });

    // Database Query Stats
    const queryStats = await this.prisma.databaseQueryLog.aggregate({
      where: { createdAt: { gte: since } },
      _avg: { executionTime: true },
      _max: { executionTime: true },
      _min: { executionTime: true },
      _count: { id: true },
    });

    const slowQueries = await this.prisma.databaseQueryLog.count({
      where: {
        createdAt: { gte: since },
        executionTime: { gte: 500 },
      },
    });

    const failedQueries = await this.prisma.databaseQueryLog.count({
      where: {
        createdAt: { gte: since },
        success: false,
      },
    });

    // Performance Bottleneck Stats
    const bottleneckStats = await this.prisma.performanceBottleneckLog.groupBy({
      by: ['type', 'severity'],
      where: { createdAt: { gte: since } },
      _count: { id: true },
    });

    return {
      days,
      api: {
        totalRequests: apiStats._count.id,
        avgLatencyMs: apiStats._avg.latencyMs,
        maxLatencyMs: apiStats._max.latencyMs,
        minLatencyMs: apiStats._min.latencyMs,
        avgRequestSize: apiStats._avg.requestSize,
        avgResponseSize: apiStats._avg.responseSize,
        slowRequests: slowApiRequests,
        slowRequestPercentage: apiStats._count.id > 0 ? (slowApiRequests / apiStats._count.id) * 100 : 0,
      },
      database: {
        totalQueries: queryStats._count.id,
        avgExecutionTimeMs: queryStats._avg.executionTime,
        maxExecutionTimeMs: queryStats._max.executionTime,
        minExecutionTimeMs: queryStats._min.executionTime,
        slowQueries,
        slowQueryPercentage: queryStats._count.id > 0 ? (slowQueries / queryStats._count.id) * 100 : 0,
        failedQueries,
        failedQueryPercentage: queryStats._count.id > 0 ? (failedQueries / queryStats._count.id) * 100 : 0,
      },
      bottlenecks: bottleneckStats.reduce(
        (acc, item) => {
          const key = `${item.type}_${item.severity}`;
          acc[key] = item._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  /**
   * Update performance bottleneck log (mark as resolved)
   */
  async updatePerformanceBottleneck(id: string, resolved: boolean, resolvedBy?: string) {
    return await this.prisma.performanceBottleneckLog.update({
      where: { id },
      data: {
        resolved,
        resolvedAt: resolved ? new Date() : null,
        resolvedBy: resolved ? resolvedBy || null : null,
      },
    });
  }

  /**
   * Get basic stats for dashboard (example query)
   */
  async getEventStats(eventType?: string, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const where: Prisma.EventWhereInput = {
      createdAt: { gte: since },
    };
    if (eventType) {
      where.eventType = eventType;
    }

    const count = await this.prisma.event.count({ where });
    const uniqueUsers = await this.prisma.event.groupBy({
      by: ['userId'],
      where: { ...where, userId: { not: null } },
    });

    return {
      eventType: eventType || 'all',
      days,
      count,
      uniqueUsers: uniqueUsers.length,
    };
  }

  /**
   * Get match stats aggregates
   */
  async getMatchStatsAggregates(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await this.prisma.matchStats.aggregate({
      where: { createdAt: { gte: since } },
      _count: { id: true },
      _avg: {
        participants: true,
        cardsPresented: true,
        cardsLiked: true,
        timeToDecisionSeconds: true,
      },
    });

    const completed = await this.prisma.matchStats.count({
      where: { createdAt: { gte: since }, completed: true },
    });

    return {
      days,
      totalMatches: stats._count.id,
      completedMatches: completed,
      completionRate: stats._count.id > 0 ? completed / stats._count.id : 0,
      avgParticipants: stats._avg.participants,
      avgCardsPresented: stats._avg.cardsPresented,
      avgCardsLiked: stats._avg.cardsLiked,
      avgTimeToDecision: stats._avg.timeToDecisionSeconds,
    };
  }

  /**
   * Get ad impression aggregates
   */
  async getAdStatsAggregates(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await this.prisma.adImpression.aggregate({
      where: { createdAt: { gte: since } },
      _count: { id: true },
      _avg: { watchedMs: true },
    });

    const completed = await this.prisma.adImpression.count({
      where: { createdAt: { gte: since }, completed: true },
    });

    return {
      days,
      totalImpressions: stats._count.id,
      completedImpressions: completed,
      completionRate: stats._count.id > 0 ? completed / stats._count.id : 0,
      avgWatchedMs: stats._avg.watchedMs,
    };
  }

  /**
   * Get revenue vs cost summary
   */
  async getRevenueCostSummary(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const revenue = await this.prisma.revenue.aggregate({
      where: { createdAt: { gte: since } },
      _sum: { amountGross: true, fees: true, amountNet: true },
    });

    const costs = await this.prisma.costExternal.findMany({
      where: { periodStart: { gte: since } },
    });

    const totalCost = costs.reduce((sum, c) => {
      return sum + Number(c.quantity) * Number(c.unitCost);
    }, 0);

    const netRevenue = Number(revenue._sum.amountNet || 0);

    return {
      days,
      grossRevenue: Number(revenue._sum.amountGross || 0),
      fees: Number(revenue._sum.fees || 0),
      netRevenue,
      totalCost,
      margin: netRevenue - totalCost,
      marginPercent: netRevenue > 0 ? ((netRevenue - totalCost) / netRevenue) * 100 : 0,
    };
  }

  /**
   * Log an error
   */
  async createErrorLog(dto: CreateErrorLogDto, defaultUserId?: string) {
    const userId = dto.errorType === 'AuthenticationError' ? dto.context?.userId as string : defaultUserId;
    
    try {
      return await this.prisma.errorLog.create({
        data: {
          userId: userId || (dto.context?.userId as string) || undefined,
          sessionId: dto.sessionId || undefined,
          errorType: dto.errorType,
          errorMessage: dto.errorMessage,
          stackTrace: dto.stackTrace || undefined,
          context: dto.context ? (dto.context as Prisma.InputJsonValue) : Prisma.JsonNull,
          severity: dto.severity || 'error',
          source: dto.source || 'server',
          route: dto.route || undefined,
          method: dto.method || undefined,
          statusCode: dto.statusCode || undefined,
          userAgent: dto.userAgent || undefined,
          ipAddress: dto.ipAddress || undefined,
        },
      });
    } catch (error) {
      // Log to console if database logging fails (circular dependency prevention)
      this.logger.error('Failed to log error to database', error);
      throw error;
    }
  }

  /**
   * Log multiple errors (batch insert)
   */
  async createErrorLogs(dtos: CreateErrorLogDto[], defaultUserId?: string) {
    const results = await Promise.allSettled(
      dtos.map((dto) => this.createErrorLog(dto, defaultUserId)),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    if (failed > 0) {
      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => r.reason?.message || 'Unknown error');
      this.logger.warn(`Error log ingestion: ${succeeded} succeeded, ${failed} failed`, errors);
    }

    return { succeeded, failed, total: dtos.length };
  }

  /**
   * Update an error log (e.g., mark as resolved)
   */
  async updateErrorLog(id: string, dto: UpdateErrorLogDto) {
    const updateData: Prisma.ErrorLogUpdateInput = {};
    
    if (dto.resolved !== undefined) {
      updateData.resolved = dto.resolved;
      if (dto.resolved) {
        updateData.resolvedAt = new Date();
      } else {
        updateData.resolvedAt = null;
      }
    }
    
    if (dto.resolvedBy) {
      updateData.resolvedBy = dto.resolvedBy;
    }

    return await this.prisma.errorLog.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Get error logs with filtering (defaults to 30-day retention)
   */
  async getErrorLogs(filters: {
    severity?: string;
    errorType?: string;
    resolved?: boolean;
    source?: string;
    userId?: string;
    days?: number;
    limit?: number;
    offset?: number;
  } = {}) {
    const since = filters.days
      ? new Date(Date.now() - filters.days * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days

    const where: Prisma.ErrorLogWhereInput = {};
    
    if (filters.severity) where.severity = filters.severity;
    if (filters.errorType) where.errorType = filters.errorType;
    if (filters.resolved !== undefined) where.resolved = filters.resolved;
    if (filters.source) where.source = filters.source;
    if (filters.userId) where.userId = filters.userId;
    if (since) where.createdAt = { gte: since };

    const [logs, total] = await Promise.all([
      this.prisma.errorLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 100,
        skip: filters.offset || 0,
      }),
      this.prisma.errorLog.count({ where }),
    ]);

    return {
      logs,
      total,
      limit: filters.limit || 100,
      offset: filters.offset || 0,
    };
  }

  /**
   * Get error statistics
   */
  async getErrorStats(days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [total, bySeverity, byType, unresolved] = await Promise.all([
      this.prisma.errorLog.count({ where: { createdAt: { gte: since } } }),
      this.prisma.errorLog.groupBy({
        by: ['severity'],
        where: { createdAt: { gte: since } },
        _count: { id: true },
      }),
      this.prisma.errorLog.groupBy({
        by: ['errorType'],
        where: { createdAt: { gte: since } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      this.prisma.errorLog.count({
        where: { createdAt: { gte: since }, resolved: false },
      }),
    ]);

    return {
      days,
      total,
      unresolved,
      resolved: total - unresolved,
      bySeverity: bySeverity.reduce((acc, item) => {
        acc[item.severity] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      topErrors: byType.map((item) => ({
        errorType: item.errorType,
        count: item._count.id,
      })),
    };
  }
}

