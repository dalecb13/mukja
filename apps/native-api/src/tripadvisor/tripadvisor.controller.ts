import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TripadvisorService } from './tripadvisor.service';
import { LocationSearchDto, LocationCategory } from './dto/location-search.dto';
import {
  LocationSearchResponseDto,
  LocationDetailsDto,
  LocationPhotosResponseDto,
} from './dto/location-response.dto';

@ApiTags('TripAdvisor')
@Controller('tripadvisor')
export class TripadvisorController {
  constructor(private readonly tripadvisorService: TripadvisorService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for locations' })
  @ApiQuery({
    name: 'searchQuery',
    required: true,
    description: 'Search query string',
    example: 'pizza new york',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: LocationCategory,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'latLong',
    required: false,
    description: 'Latitude and longitude (lat,long)',
    example: '40.7128,-74.0060',
  })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Language code',
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'List of matching locations',
    type: LocationSearchResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async searchLocations(
    @Query() query: LocationSearchDto,
  ): Promise<LocationSearchResponseDto> {
    return this.tripadvisorService.searchLocations(
      query.searchQuery,
      query.category,
      query.latLong,
      query.language,
    );
  }

  @Get('location/:id')
  @ApiOperation({ summary: 'Get location details' })
  @ApiParam({
    name: 'id',
    description: 'TripAdvisor location ID',
    example: '60763',
  })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Language code',
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'Location details',
    type: LocationDetailsDto,
  })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async getLocationDetails(
    @Param('id') id: string,
    @Query('language') language?: string,
  ): Promise<LocationDetailsDto> {
    return this.tripadvisorService.getLocationDetails(id, language);
  }

  @Get('location/:id/photos')
  @ApiOperation({ summary: 'Get location photos' })
  @ApiParam({
    name: 'id',
    description: 'TripAdvisor location ID',
    example: '60763',
  })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Language code',
    example: 'en',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of photos to return',
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Location photos',
    type: LocationPhotosResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async getLocationPhotos(
    @Param('id') id: string,
    @Query('language') language?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<LocationPhotosResponseDto> {
    return this.tripadvisorService.getLocationPhotos(
      id,
      language,
      limit || 10,
      offset || 0,
    );
  }
}






