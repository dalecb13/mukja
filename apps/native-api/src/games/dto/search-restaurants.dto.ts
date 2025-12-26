import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum RestaurantCategory {
  RESTAURANTS = 'restaurants',
}

export class SearchRestaurantsDto {
  @ApiProperty({ example: 'pizza near me', description: 'Search query for restaurants' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ example: '40.7128,-74.0060', description: 'Latitude,Longitude for location-based search' })
  @IsOptional()
  @IsString()
  latLong?: string;
}






