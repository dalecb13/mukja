import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateAdImpressionDto {
  @ApiProperty({ description: 'Placement of the ad (e.g., results_gate)' })
  @IsString()
  @IsNotEmpty()
  placement: string;

  @ApiProperty({ description: 'Milliseconds the ad was watched' })
  @IsInt()
  @Min(0)
  watchedMs: number;

  @ApiProperty({ description: 'Whether the ad was completed' })
  @IsBoolean()
  completed: boolean;

  @ApiPropertyOptional({ description: 'User ID (if not inferred from token)' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Ad provider name' })
  @IsString()
  @IsOptional()
  provider?: string;
}



