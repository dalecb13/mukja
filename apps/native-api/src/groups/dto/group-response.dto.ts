import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupMemberUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  name?: string;
}

export class GroupMemberDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: GroupMemberUserDto })
  user: GroupMemberUserDto;

  @ApiProperty({ enum: ['OWNER', 'ADMIN', 'MEMBER'] })
  role: string;

  @ApiProperty()
  joinedAt: Date;
}

export class GroupDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: GroupMemberUserDto })
  owner: GroupMemberUserDto;

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GroupDetailDto extends GroupDto {
  @ApiProperty({ type: [GroupMemberDto] })
  members: GroupMemberDto[];
}

