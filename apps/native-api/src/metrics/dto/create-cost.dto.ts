import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateCostDto {
  @ApiProperty({ description: 'Service name (tripadvisor, stripe, vercel, etc.)' })
  @IsString()
  @IsNotEmpty()
  service: string;

  @ApiProperty({ description: 'Unit type (per_request, per_1000_requests, percent_of_gmv, flat_monthly)' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ description: 'Quantity of units' })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Cost per unit in USD' })
  @IsNumber()
  @Min(0)
  unitCost: number;

  @ApiProperty({ description: 'Period start date (YYYY-MM-DD)' })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ description: 'Period end date (YYYY-MM-DD)' })
  @IsDateString()
  periodEnd: string;

  @ApiPropertyOptional({ description: 'Optional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}



