import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EventDto {
  @ApiProperty({ description: 'Event type (e.g., match_created, card_shown)' })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty({ description: 'Client-generated session ID' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiPropertyOptional({ description: 'User ID (if authenticated)' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Event properties (schemaless payload)' })
  @IsObject()
  @IsOptional()
  properties?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Idempotency key to prevent duplicates' })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;

  @ApiPropertyOptional({ description: 'Source of the event (native-app, web, server)' })
  @IsString()
  @IsOptional()
  source?: string;
}

export class CreateEventsDto {
  @ApiProperty({ type: [EventDto], description: 'Array of events to ingest' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];
}

