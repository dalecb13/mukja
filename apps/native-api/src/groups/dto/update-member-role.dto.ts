import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum GroupRoleDto {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: GroupRoleDto, example: 'ADMIN' })
  @IsEnum(GroupRoleDto)
  role: GroupRoleDto;
}






