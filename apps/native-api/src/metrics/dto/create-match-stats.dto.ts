import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateMatchStatsDto {
  @ApiProperty({ description: 'Unique match ID' })
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @ApiProperty({ description: 'Match mode: solo or group' })
  @IsString()
  @IsNotEmpty()
  mode: string;

  @ApiProperty({ description: 'Vote rule: majority, unanimous, first_to_x' })
  @IsString()
  @IsNotEmpty()
  voteRule: string;

  @ApiProperty({ description: 'Number of participants' })
  @IsInt()
  @Min(1)
  participants: number;

  @ApiProperty({ description: 'Number of restaurant cards presented' })
  @IsInt()
  @Min(0)
  cardsPresented: number;

  @ApiProperty({ description: 'Number of cards liked' })
  @IsInt()
  @Min(0)
  cardsLiked: number;

  @ApiPropertyOptional({ description: 'Time to reach decision in seconds' })
  @IsInt()
  @IsOptional()
  @Min(0)
  timeToDecisionSeconds?: number;

  @ApiPropertyOptional({ description: 'TripAdvisor location ID of the result' })
  @IsString()
  @IsOptional()
  resultRestaurantId?: string;

  @ApiProperty({ description: 'Whether the match was completed' })
  @IsBoolean()
  completed: boolean;
}



