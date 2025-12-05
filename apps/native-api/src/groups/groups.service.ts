import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FriendsService } from '../friends/friends.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupDto, GroupDetailDto, GroupMemberDto } from './dto/group-response.dto';

@Injectable()
export class GroupsService {
  constructor(
    private prisma: PrismaService,
    private friendsService: FriendsService,
  ) {}

  async createGroup(userId: string, dto: CreateGroupDto): Promise<GroupDto> {
    const group = await this.prisma.group.create({
      data: {
        name: dto.name,
        description: dto.description,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        _count: { select: { members: true } },
      },
    });

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      owner: group.owner,
      memberCount: group._count.members,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  async getUserGroups(userId: string): Promise<GroupDto[]> {
    const memberships = await this.prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            owner: { select: { id: true, email: true, name: true } },
            _count: { select: { members: true } },
          },
        },
      },
    });

    return memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      description: m.group.description,
      owner: m.group.owner,
      memberCount: m.group._count.members,
      createdAt: m.group.createdAt,
      updatedAt: m.group.updatedAt,
    }));
  }

  async getGroupDetails(userId: string, groupId: string): Promise<GroupDetailDto> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
          orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Check if user is a member
    const isMember = group.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      owner: group.owner,
      memberCount: group.members.length,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      members: group.members.map((m) => ({
        id: m.id,
        user: m.user,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
    };
  }

  async updateGroup(
    userId: string,
    groupId: string,
    dto: UpdateGroupDto,
  ): Promise<GroupDto> {
    const membership = await this.getMembershipOrThrow(userId, groupId);

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException('Only owner or admin can update group');
    }

    const group = await this.prisma.group.update({
      where: { id: groupId },
      data: dto,
      include: {
        owner: { select: { id: true, email: true, name: true } },
        _count: { select: { members: true } },
      },
    });

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      owner: group.owner,
      memberCount: group._count.members,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  async deleteGroup(userId: string, groupId: string): Promise<void> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can delete the group');
    }

    await this.prisma.group.delete({
      where: { id: groupId },
    });
  }

  async addMember(
    userId: string,
    groupId: string,
    targetUserId: string,
  ): Promise<GroupMemberDto> {
    const membership = await this.getMembershipOrThrow(userId, groupId);

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException('Only owner or admin can add members');
    }

    // Check if target is already a member
    const existingMember = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: targetUserId } },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this group');
    }

    // Check if target is a friend
    const friends = await this.friendsService.getFriends(userId);
    const isFriend = friends.some((f) => f.friend.id === targetUserId);

    if (!isFriend) {
      throw new BadRequestException('Can only add friends to groups');
    }

    const member = await this.prisma.groupMember.create({
      data: {
        groupId,
        userId: targetUserId,
        role: 'MEMBER',
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    return {
      id: member.id,
      user: member.user,
      role: member.role,
      joinedAt: member.joinedAt,
    };
  }

  async removeMember(
    userId: string,
    groupId: string,
    targetUserId: string,
  ): Promise<void> {
    const membership = await this.getMembershipOrThrow(userId, groupId);
    const targetMembership = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: targetUserId } },
    });

    if (!targetMembership) {
      throw new NotFoundException('Member not found in group');
    }

    // Owner cannot be removed
    if (targetMembership.role === 'OWNER') {
      throw new ForbiddenException('Cannot remove the group owner');
    }

    // Self-removal is allowed
    if (userId === targetUserId) {
      await this.prisma.groupMember.delete({
        where: { id: targetMembership.id },
      });
      return;
    }

    // Only owner/admin can remove others
    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException('Only owner or admin can remove members');
    }

    // Admin cannot remove other admins
    if (membership.role === 'ADMIN' && targetMembership.role === 'ADMIN') {
      throw new ForbiddenException('Admins cannot remove other admins');
    }

    await this.prisma.groupMember.delete({
      where: { id: targetMembership.id },
    });
  }

  async updateMemberRole(
    userId: string,
    groupId: string,
    targetUserId: string,
    role: 'ADMIN' | 'MEMBER',
  ): Promise<GroupMemberDto> {
    const membership = await this.getMembershipOrThrow(userId, groupId);

    if (membership.role !== 'OWNER') {
      throw new ForbiddenException('Only the owner can change member roles');
    }

    const targetMembership = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: targetUserId } },
    });

    if (!targetMembership) {
      throw new NotFoundException('Member not found in group');
    }

    if (targetMembership.role === 'OWNER') {
      throw new ForbiddenException('Cannot change owner role');
    }

    const updated = await this.prisma.groupMember.update({
      where: { id: targetMembership.id },
      data: { role },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    return {
      id: updated.id,
      user: updated.user,
      role: updated.role,
      joinedAt: updated.joinedAt,
    };
  }

  async leaveGroup(userId: string, groupId: string): Promise<void> {
    const membership = await this.getMembershipOrThrow(userId, groupId);

    if (membership.role === 'OWNER') {
      throw new BadRequestException(
        'Owner cannot leave the group. Transfer ownership or delete the group.',
      );
    }

    await this.prisma.groupMember.delete({
      where: { id: membership.id },
    });
  }

  private async getMembershipOrThrow(userId: string, groupId: string) {
    const membership = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return membership;
  }
}

