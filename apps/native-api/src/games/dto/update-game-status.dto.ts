import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum GameStatusDto {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class UpdateGameStatusDto {
  @ApiProperty({ enum: GameStatusDto, example: 'COMPLETED' })
  @IsEnum(GameStatusDto)
  status: GameStatusDto;
}




