import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateGameDto {
  @ApiPropertyOptional({ description: 'Group ID for group game, omit for solo game' })
  @IsOptional()
  @IsString()
  groupId?: string;
}






