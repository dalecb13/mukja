import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GameFiltersDto {
  @ApiPropertyOptional({ description: 'Cuisine type filter' })
  @IsOptional()
  @IsString()
  cuisine?: string;

  @ApiPropertyOptional({ description: 'Price range filter ($, $$, $$$, $$$$)' })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({ description: 'Minimum rating filter' })
  @IsOptional()
  @IsString()
  minRating?: string;

  @ApiPropertyOptional({ description: 'Dietary restrictions', type: [String] })
  @IsOptional()
  dietaryRestrictions?: string[];
}

export class CreateGameDto {
  @ApiPropertyOptional({ description: 'Group ID for group game, omit for solo game' })
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiPropertyOptional({ description: 'Restaurant filters', type: GameFiltersDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GameFiltersDto)
  filters?: GameFiltersDto;

  @ApiPropertyOptional({ description: 'Map area as GeoJSON Polygon' })
  @IsOptional()
  @IsObject()
  mapArea?: {
    type: 'Polygon';
    coordinates: [[number, number][]];
  };
}






