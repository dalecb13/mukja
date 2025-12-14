import { ApiProperty } from '@nestjs/swagger';

export class FriendUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  name?: string;
}

export class FriendshipDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED'] })
  status: string;

  @ApiProperty({ type: FriendUserDto })
  requester: FriendUserDto;

  @ApiProperty({ type: FriendUserDto })
  addressee: FriendUserDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class FriendDto {
  @ApiProperty()
  friendshipId: string;

  @ApiProperty({ type: FriendUserDto })
  friend: FriendUserDto;

  @ApiProperty()
  since: Date;
}

export class FriendRequestDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: FriendUserDto })
  user: FriendUserDto;

  @ApiProperty()
  createdAt: Date;
}

