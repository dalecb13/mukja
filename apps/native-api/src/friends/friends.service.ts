import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FriendDto, FriendRequestDto } from './dto/friendship-response.dto';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(requesterId: string, addresseeId: string): Promise<void> {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    // Check if addressee exists
    const addressee = await this.prisma.user.findUnique({
      where: { id: addresseeId },
    });

    if (!addressee) {
      throw new NotFoundException('User not found');
    }

    // Check if friendship already exists (in either direction)
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'BLOCKED') {
        throw new ForbiddenException('Cannot send friend request');
      }
      if (existingFriendship.status === 'ACCEPTED') {
        throw new ConflictException('Already friends');
      }
      if (existingFriendship.status === 'PENDING') {
        throw new ConflictException('Friend request already pending');
      }
    }

    await this.prisma.friendship.create({
      data: {
        requesterId,
        addresseeId,
        status: 'PENDING',
      },
    });
  }

  async acceptFriendRequest(userId: string, friendshipId: string): Promise<void> {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendship.addresseeId !== userId) {
      throw new ForbiddenException('Cannot accept this friend request');
    }

    if (friendship.status !== 'PENDING') {
      throw new BadRequestException('Friend request is not pending');
    }

    await this.prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'ACCEPTED' },
    });
  }

  async rejectFriendRequest(userId: string, friendshipId: string): Promise<void> {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendship.addresseeId !== userId) {
      throw new ForbiddenException('Cannot reject this friend request');
    }

    if (friendship.status !== 'PENDING') {
      throw new BadRequestException('Friend request is not pending');
    }

    await this.prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'REJECTED' },
    });
  }

  async removeFriend(userId: string, friendshipId: string): Promise<void> {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    // User must be part of the friendship
    if (friendship.requesterId !== userId && friendship.addresseeId !== userId) {
      throw new ForbiddenException('Cannot remove this friendship');
    }

    await this.prisma.friendship.delete({
      where: { id: friendshipId },
    });
  }

  async blockUser(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new BadRequestException('Cannot block yourself');
    }

    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!target) {
      throw new NotFoundException('User not found');
    }

    // Check if friendship exists
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: targetUserId },
          { requesterId: targetUserId, addresseeId: userId },
        ],
      },
    });

    if (existingFriendship) {
      // Update existing friendship to blocked
      await this.prisma.friendship.update({
        where: { id: existingFriendship.id },
        data: {
          status: 'BLOCKED',
          requesterId: userId, // Blocker becomes requester
          addresseeId: targetUserId,
        },
      });
    } else {
      // Create new blocked relationship
      await this.prisma.friendship.create({
        data: {
          requesterId: userId,
          addresseeId: targetUserId,
          status: 'BLOCKED',
        },
      });
    }
  }

  async getFriends(userId: string): Promise<FriendDto[]> {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: {
          select: { id: true, email: true, name: true },
        },
        addressee: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return friendships.map((f) => ({
      friendshipId: f.id,
      friend: f.requesterId === userId ? f.addressee : f.requester,
      since: f.updatedAt,
    }));
  }

  async getIncomingRequests(userId: string): Promise<FriendRequestDto[]> {
    const requests = await this.prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: 'PENDING',
      },
      include: {
        requester: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return requests.map((r) => ({
      id: r.id,
      user: r.requester,
      createdAt: r.createdAt,
    }));
  }

  async getOutgoingRequests(userId: string): Promise<FriendRequestDto[]> {
    const requests = await this.prisma.friendship.findMany({
      where: {
        requesterId: userId,
        status: 'PENDING',
      },
      include: {
        addressee: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return requests.map((r) => ({
      id: r.id,
      user: r.addressee,
      createdAt: r.createdAt,
    }));
  }
}

