import {
  Controller,
  Post,
  Get,
  Body,
  Query,
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
}



