import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { FriendDto, FriendRequestDto } from './dto/friendship-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of friends' })
  @ApiResponse({
    status: 200,
    description: 'List of friends',
    type: [FriendDto],
  })
  async getFriends(@CurrentUser('id') userId: string): Promise<FriendDto[]> {
    return this.friendsService.getFriends(userId);
  }

  @Get('requests/incoming')
  @ApiOperation({ summary: 'Get incoming friend requests' })
  @ApiResponse({
    status: 200,
    description: 'List of incoming friend requests',
    type: [FriendRequestDto],
  })
  async getIncomingRequests(
    @CurrentUser('id') userId: string,
  ): Promise<FriendRequestDto[]> {
    return this.friendsService.getIncomingRequests(userId);
  }

  @Get('requests/outgoing')
  @ApiOperation({ summary: 'Get outgoing friend requests' })
  @ApiResponse({
    status: 200,
    description: 'List of outgoing friend requests',
    type: [FriendRequestDto],
  })
  async getOutgoingRequests(
    @CurrentUser('id') userId: string,
  ): Promise<FriendRequestDto[]> {
    return this.friendsService.getOutgoingRequests(userId);
  }

  @Post('request/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiParam({ name: 'userId', description: 'ID of user to send request to' })
  @ApiResponse({ status: 204, description: 'Friend request sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Already friends or request pending' })
  async sendFriendRequest(
    @CurrentUser('id') requesterId: string,
    @Param('userId') addresseeId: string,
  ): Promise<void> {
    return this.friendsService.sendFriendRequest(requesterId, addresseeId);
  }

  @Post('accept/:friendshipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiParam({ name: 'friendshipId', description: 'ID of the friendship/request' })
  @ApiResponse({ status: 204, description: 'Friend request accepted' })
  @ApiResponse({ status: 404, description: 'Friend request not found' })
  @ApiResponse({ status: 403, description: 'Cannot accept this request' })
  async acceptFriendRequest(
    @CurrentUser('id') userId: string,
    @Param('friendshipId') friendshipId: string,
  ): Promise<void> {
    return this.friendsService.acceptFriendRequest(userId, friendshipId);
  }

  @Post('reject/:friendshipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reject a friend request' })
  @ApiParam({ name: 'friendshipId', description: 'ID of the friendship/request' })
  @ApiResponse({ status: 204, description: 'Friend request rejected' })
  @ApiResponse({ status: 404, description: 'Friend request not found' })
  @ApiResponse({ status: 403, description: 'Cannot reject this request' })
  async rejectFriendRequest(
    @CurrentUser('id') userId: string,
    @Param('friendshipId') friendshipId: string,
  ): Promise<void> {
    return this.friendsService.rejectFriendRequest(userId, friendshipId);
  }

  @Delete(':friendshipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a friend or cancel a request' })
  @ApiParam({ name: 'friendshipId', description: 'ID of the friendship' })
  @ApiResponse({ status: 204, description: 'Friendship removed' })
  @ApiResponse({ status: 404, description: 'Friendship not found' })
  @ApiResponse({ status: 403, description: 'Cannot remove this friendship' })
  async removeFriend(
    @CurrentUser('id') userId: string,
    @Param('friendshipId') friendshipId: string,
  ): Promise<void> {
    return this.friendsService.removeFriend(userId, friendshipId);
  }

  @Post('block/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Block a user' })
  @ApiParam({ name: 'userId', description: 'ID of user to block' })
  @ApiResponse({ status: 204, description: 'User blocked' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async blockUser(
    @CurrentUser('id') userId: string,
    @Param('userId') targetUserId: string,
  ): Promise<void> {
    return this.friendsService.blockUser(userId, targetUserId);
  }
}

