import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum LocationCategory {
  HOTELS = 'hotels',
  ATTRACTIONS = 'attractions',
  RESTAURANTS = 'restaurants',
  GEOS = 'geos',
}

export class LocationSearchDto {
  @ApiProperty({ description: 'Search query string', example: 'pizza' })
  @IsString()
  searchQuery: string;

  @ApiPropertyOptional({
    description: 'Category filter',
    enum: LocationCategory,
    example: LocationCategory.RESTAURANTS,
  })
  @IsOptional()
  @IsEnum(LocationCategory)
  category?: LocationCategory;

  @ApiPropertyOptional({
    description: 'Latitude and longitude (lat,long)',
    example: '40.7128,-74.0060',
  })
  @IsOptional()
  @IsString()
  latLong?: string;

  @ApiPropertyOptional({
    description: 'Language code',
    example: 'en',
    default: 'en',
  })
  @IsOptional()
  @IsString()
  language?: string;
}




