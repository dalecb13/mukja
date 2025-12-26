import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MetricsService } from './metrics.service';
import {
  CreateEventsDto,
  CreateMatchStatsDto,
  CreateAdImpressionDto,
  CreateCostDto,
  CreateRevenueDto,
  CreateErrorLogDto,
  CreateErrorLogsDto,
  UpdateErrorLogDto,
} from './dto';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post('events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Ingest client/server events' })
  @ApiResponse({ status: 202, description: 'Events accepted for processing' })
  async ingestEvents(@Body() dto: CreateEventsDto, @Request() req: any) {
    const userId = req.user?.id;
    const result = await this.metricsService.ingestEvents(dto.events, userId);
    return {
      message: 'Events accepted',
      ...result,
    };
  }

  @Post('match')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record match statistics' })
  @ApiResponse({ status: 201, description: 'Match stats recorded' })
  async recordMatchStats(@Body() dto: CreateMatchStatsDto) {
    const result = await this.metricsService.upsertMatchStats(dto);
    return {
      message: 'Match stats recorded',
      matchId: result.matchId,
    };
  }

  @Post('ad')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record ad impression' })
  @ApiResponse({ status: 201, description: 'Ad impression recorded' })
  async recordAdImpression(@Body() dto: CreateAdImpressionDto, @Request() req: any) {
    const userId = req.user?.id;
    const result = await this.metricsService.createAdImpression(dto, userId);
    return {
      message: 'Ad impression recorded',
      id: result.id,
    };
  }

  @Post('costs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record external service cost (admin)' })
  @ApiResponse({ status: 201, description: 'Cost entry recorded' })
  async recordCost(@Body() dto: CreateCostDto) {
    // TODO: Add admin role check
    const result = await this.metricsService.createCost(dto);
    return {
      message: 'Cost entry recorded',
      id: result.id,
    };
  }

  @Post('revenue')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record revenue entry (admin/webhook)' })
  @ApiResponse({ status: 201, description: 'Revenue entry recorded' })
  async recordRevenue(@Body() dto: CreateRevenueDto) {
    // TODO: Add admin role check or webhook verification
    const result = await this.metricsService.createRevenue(dto);
    return {
      message: 'Revenue entry recorded',
      id: result.id,
    };
  }

  // ========== Dashboard/Stats Endpoints ==========

  @Get('stats/events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event statistics' })
  @ApiQuery({ name: 'eventType', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Event statistics' })
  async getEventStats(
    @Query('eventType') eventType?: string,
    @Query('days') days?: string,
  ) {
    return await this.metricsService.getEventStats(eventType, days ? parseInt(days) : 7);
  }

  @Get('stats/matches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get match statistics aggregates' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Match statistics' })
  async getMatchStats(@Query('days') days?: string) {
    return await this.metricsService.getMatchStatsAggregates(days ? parseInt(days) : 30);
  }

  @Get('stats/ads')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ad impression statistics' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Ad statistics' })
  async getAdStats(@Query('days') days?: string) {
    return await this.metricsService.getAdStatsAggregates(days ? parseInt(days) : 30);
  }

  @Get('stats/revenue-cost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get revenue vs cost summary' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Revenue vs cost summary' })
  async getRevenueCost(@Query('days') days?: string) {
    return await this.metricsService.getRevenueCostSummary(days ? parseInt(days) : 30);
  }

  // ========== Error Logging Endpoints ==========

  @Post('errors')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Log an error (public endpoint for client-side errors)' })
  @ApiResponse({ status: 201, description: 'Error logged successfully' })
  async logError(@Body() dto: CreateErrorLogDto, @Request() req: any) {
    const userId = req.user?.id;
    const result = await this.metricsService.createErrorLog(dto, userId);
    return {
      message: 'Error logged',
      id: result.id,
    };
  }

  @Post('errors/batch')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Log multiple errors (batch)' })
  @ApiResponse({ status: 202, description: 'Errors accepted for processing' })
  async logErrors(@Body() dto: CreateErrorLogsDto, @Request() req: any) {
    const userId = req.user?.id;
    const result = await this.metricsService.createErrorLogs(dto.errors, userId);
    return {
      message: 'Errors accepted',
      ...result,
    };
  }

  @Get('errors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get error logs with filtering' })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'errorType', required: false })
  @ApiQuery({ name: 'resolved', required: false, type: Boolean })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Error logs' })
  async getErrorLogs(
    @Query('severity') severity?: string,
    @Query('errorType') errorType?: string,
    @Query('resolved') resolved?: string,
    @Query('source') source?: string,
    @Query('userId') userId?: string,
    @Query('days') days?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return await this.metricsService.getErrorLogs({
      severity,
      errorType,
      resolved: resolved !== undefined ? resolved === 'true' : undefined,
      source,
      userId,
      days: days ? parseInt(days) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Patch('errors/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an error log (e.g., mark as resolved)' })
  @ApiResponse({ status: 200, description: 'Error log updated' })
  async updateErrorLog(
    @Param('id') id: string,
    @Body() dto: UpdateErrorLogDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    const updateData = {
      ...dto,
      resolvedBy: dto.resolved ? userId : dto.resolvedBy,
    };
    const result = await this.metricsService.updateErrorLog(id, updateData);
    return {
      message: 'Error log updated',
      id: result.id,
    };
  }

  @Get('stats/errors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get error statistics' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Error statistics' })
  async getErrorStats(@Query('days') days?: string) {
    return await this.metricsService.getErrorStats(days ? parseInt(days) : 7);
  }

  // ========== Database Query Logging Endpoints ==========

  @Get('database-queries')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get database query logs (30-day retention)' })
  @ApiQuery({ name: 'model', required: false })
  @ApiQuery({ name: 'operation', required: false })
  @ApiQuery({ name: 'minExecutionTime', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'route', required: false })
  @ApiQuery({ name: 'success', required: false, type: Boolean })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Database query logs' })
  async getDatabaseQueryLogs(
    @Query('model') model?: string,
    @Query('operation') operation?: string,
    @Query('minExecutionTime') minExecutionTime?: string,
    @Query('userId') userId?: string,
    @Query('route') route?: string,
    @Query('success') success?: string,
    @Query('days') days?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return await this.metricsService.getDatabaseQueryLogs({
      model,
      operation,
      minExecutionTime: minExecutionTime ? parseInt(minExecutionTime) : undefined,
      userId,
      route,
      success: success !== undefined ? success === 'true' : undefined,
      days: days ? parseInt(days) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  // ========== Performance Bottleneck Endpoints ==========

  @Get('performance-bottlenecks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get performance bottleneck logs (30-day retention)' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'resolved', required: false, type: Boolean })
  @ApiQuery({ name: 'resource', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Performance bottleneck logs' })
  async getPerformanceBottleneckLogs(
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('resolved') resolved?: string,
    @Query('resource') resource?: string,
    @Query('days') days?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return await this.metricsService.getPerformanceBottleneckLogs({
      type,
      severity,
      resolved: resolved !== undefined ? resolved === 'true' : undefined,
      resource,
      days: days ? parseInt(days) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Patch('performance-bottlenecks/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update performance bottleneck log (mark as resolved)' })
  @ApiResponse({ status: 200, description: 'Performance bottleneck log updated' })
  async updatePerformanceBottleneck(
    @Param('id') id: string,
    @Request() req: any,
    @Query('resolved') resolved?: string,
  ) {
    const userId = req.user?.id;
    const isResolved = resolved === 'true';
    const result = await this.metricsService.updatePerformanceBottleneck(
      id,
      isResolved,
      userId,
    );
    return {
      message: 'Performance bottleneck log updated',
      id: result.id,
    };
  }

  @Get('stats/performance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get performance statistics (30-day retention)' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Performance statistics' })
  async getPerformanceStats(@Query('days') days?: string) {
    return await this.metricsService.getPerformanceStats(days ? parseInt(days) : 30);
  }
}



