import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { GroupDto, GroupDetailDto, GroupMemberDto } from './dto/group-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created', type: GroupDto })
  async createGroup(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateGroupDto,
  ): Promise<GroupDto> {
    return this.groupsService.createGroup(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups the user belongs to' })
  @ApiResponse({ status: 200, description: 'List of groups', type: [GroupDto] })
  async getUserGroups(@CurrentUser('id') userId: string): Promise<GroupDto[]> {
    return this.groupsService.getUserGroups(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group details with members' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group details', type: GroupDetailDto })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({ status: 403, description: 'Not a member of this group' })
  async getGroupDetails(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
  ): Promise<GroupDetailDto> {
    return this.groupsService.getGroupDetails(userId, groupId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update group details' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group updated', type: GroupDto })
  @ApiResponse({ status: 403, description: 'Only owner/admin can update' })
  async updateGroup(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
    @Body() dto: UpdateGroupDto,
  ): Promise<GroupDto> {
    return this.groupsService.updateGroup(userId, groupId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 204, description: 'Group deleted' })
  @ApiResponse({ status: 403, description: 'Only owner can delete' })
  async deleteGroup(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
  ): Promise<void> {
    return this.groupsService.deleteGroup(userId, groupId);
  }

  @Post(':id/members/:userId')
  @ApiOperation({ summary: 'Add a friend to the group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiParam({ name: 'userId', description: 'User ID to add' })
  @ApiResponse({ status: 201, description: 'Member added', type: GroupMemberDto })
  @ApiResponse({ status: 400, description: 'Can only add friends' })
  @ApiResponse({ status: 409, description: 'User already a member' })
  async addMember(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
    @Param('userId') targetUserId: string,
  ): Promise<GroupMemberDto> {
    return this.groupsService.addMember(userId, groupId, targetUserId);
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a member from the group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiParam({ name: 'userId', description: 'User ID to remove' })
  @ApiResponse({ status: 204, description: 'Member removed' })
  @ApiResponse({ status: 403, description: 'Cannot remove owner or insufficient permissions' })
  async removeMember(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
    @Param('userId') targetUserId: string,
  ): Promise<void> {
    return this.groupsService.removeMember(userId, groupId, targetUserId);
  }

  @Patch(':id/members/:userId/role')
  @ApiOperation({ summary: 'Change a member\'s role' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiParam({ name: 'userId', description: 'User ID to update' })
  @ApiResponse({ status: 200, description: 'Role updated', type: GroupMemberDto })
  @ApiResponse({ status: 403, description: 'Only owner can change roles' })
  async updateMemberRole(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateMemberRoleDto,
  ): Promise<GroupMemberDto> {
    return this.groupsService.updateMemberRole(userId, groupId, targetUserId, dto.role);
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Leave a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 204, description: 'Left the group' })
  @ApiResponse({ status: 400, description: 'Owner cannot leave' })
  async leaveGroup(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
  ): Promise<void> {
    return this.groupsService.leaveGroup(userId, groupId);
  }
}




