import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsObject,
  IsNotEmpty,
  IsIn,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateErrorLogDto {
  @ApiProperty({ description: 'Type/category of the error (e.g., ValidationError, DatabaseError, NetworkError)' })
  @IsString()
  @IsNotEmpty()
  errorType: string;

  @ApiProperty({ description: 'Error message' })
  @IsString()
  @IsNotEmpty()
  errorMessage: string;

  @ApiPropertyOptional({ description: 'Stack trace if available' })
  @IsString()
  @IsOptional()
  stackTrace?: string;

  @ApiPropertyOptional({ description: 'Additional context as key-value pairs' })
  @IsObject()
  @IsOptional()
  context?: Record<string, unknown>;

  @ApiPropertyOptional({ 
    description: 'Severity level',
    enum: ['error', 'warning', 'critical'],
    default: 'error'
  })
  @IsString()
  @IsIn(['error', 'warning', 'critical'])
  @IsOptional()
  severity?: 'error' | 'warning' | 'critical';

  @ApiPropertyOptional({ 
    description: 'Source of the error',
    enum: ['server', 'client', 'native-app', 'web'],
    default: 'server'
  })
  @IsString()
  @IsIn(['server', 'client', 'native-app', 'web'])
  @IsOptional()
  source?: 'server' | 'client' | 'native-app' | 'web';

  @ApiPropertyOptional({ description: 'API route if applicable' })
  @IsString()
  @IsOptional()
  route?: string;

  @ApiPropertyOptional({ description: 'HTTP method if applicable' })
  @IsString()
  @IsOptional()
  method?: string;

  @ApiPropertyOptional({ description: 'HTTP status code if applicable' })
  @IsInt()
  @Min(100)
  @Max(599)
  @IsOptional()
  statusCode?: number;

  @ApiPropertyOptional({ description: 'User agent if available' })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'IP address if available' })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Session ID for tracking' })
  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class CreateErrorLogsDto {
  @ApiProperty({ type: [CreateErrorLogDto], description: 'Array of error logs to create' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateErrorLogDto)
  errors: CreateErrorLogDto[];
}

export class UpdateErrorLogDto {
  @ApiPropertyOptional({ description: 'Mark error as resolved' })
  @IsBoolean()
  @IsOptional()
  resolved?: boolean;

  @ApiPropertyOptional({ description: 'User ID who resolved the error' })
  @IsString()
  @IsOptional()
  resolvedBy?: string;
}

