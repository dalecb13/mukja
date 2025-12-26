import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateRevenueDto {
  @ApiPropertyOptional({ description: 'User ID (if attributable)' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Revenue source (stripe, ads, etc.)' })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ description: 'Plan type (free, monthly, yearly)' })
  @IsString()
  @IsNotEmpty()
  plan: string;

  @ApiProperty({ description: 'Gross amount in USD' })
  @IsNumber()
  @Min(0)
  amountGross: number;

  @ApiProperty({ description: 'Fees in USD (Stripe fees, app store, etc.)' })
  @IsNumber()
  @Min(0)
  fees: number;

  @ApiProperty({ description: 'Net amount in USD' })
  @IsNumber()
  amountNet: number;

  @ApiPropertyOptional({ description: 'Subscription period start (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  periodStart?: string;

  @ApiPropertyOptional({ description: 'Subscription period end (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  periodEnd?: string;

  @ApiPropertyOptional({ description: 'External reference (e.g., Stripe charge ID)' })
  @IsString()
  @IsOptional()
  externalRef?: string;
}



