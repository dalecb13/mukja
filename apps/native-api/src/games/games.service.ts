import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripadvisorService } from '../tripadvisor/tripadvisor.service';
import { CreateGameDto } from './dto/create-game.dto';
import { SearchRestaurantsDto } from './dto/search-restaurants.dto';
import { GameDto, GameDetailDto, GameSearchDto } from './dto/game-response.dto';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private tripadvisorService: TripadvisorService,
  ) {}

  async createGame(userId: string, dto: CreateGameDto): Promise<GameDto> {
    // If groupId provided, verify user is the owner
    if (dto.groupId) {
      const group = await this.prisma.group.findUnique({
        where: { id: dto.groupId },
      });

      if (!group) {
        throw new NotFoundException('Group not found');
      }

      if (group.ownerId !== userId) {
        throw new ForbiddenException('Only group owner can start a game');
      }
    }

    const game = await this.prisma.game.create({
      data: {
        ownerId: userId,
        groupId: dto.groupId,
      },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        group: { select: { id: true, name: true } },
        _count: { select: { searches: true } },
      },
    });

    return {
      id: game.id,
      status: game.status,
      owner: game.owner,
      group: game.group,
      searchCount: game._count.searches,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    };
  }

  async getUserGames(userId: string): Promise<GameDto[]> {
    // Get games where user is owner OR is a member of the game's group
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            group: {
              members: {
                some: { userId },
              },
            },
          },
        ],
      },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        group: { select: { id: true, name: true } },
        _count: { select: { searches: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return games.map((game) => ({
      id: game.id,
      status: game.status,
      owner: game.owner,
      group: game.group,
      searchCount: game._count.searches,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    }));
  }

  async getGameDetails(userId: string, gameId: string): Promise<GameDetailDto> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        group: {
          select: {
            id: true,
            name: true,
            members: { select: { userId: true } },
          },
        },
        searches: {
          include: {
            user: { select: { id: true, email: true, name: true } },
            results: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    // Check access: owner or group member
    const hasAccess = this.checkGameAccess(userId, game);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this game');
    }

    return {
      id: game.id,
      status: game.status,
      owner: game.owner,
      group: game.group ? { id: game.group.id, name: game.group.name } : null,
      searchCount: game.searches.length,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
      searches: game.searches.map((search) => ({
        id: search.id,
        query: search.query,
        category: search.category,
        latLong: search.latLong,
        user: search.user,
        createdAt: search.createdAt,
        results: search.results,
      })),
    };
  }

  async searchRestaurants(
    userId: string,
    gameId: string,
    dto: SearchRestaurantsDto,
  ): Promise<GameSearchDto> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        group: {
          select: {
            members: { select: { userId: true } },
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.status !== 'ACTIVE') {
      throw new BadRequestException('Game is not active');
    }

    // Check access
    const hasAccess = this.checkGameAccess(userId, game);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this game');
    }

    // Search TripAdvisor for restaurants
    const searchResults = await this.tripadvisorService.searchLocations(
      dto.query,
      'restaurants',
      dto.latLong,
    );

    // Create search record with results
    const search = await this.prisma.gameSearch.create({
      data: {
        gameId,
        userId,
        query: dto.query,
        category: 'restaurants',
        latLong: dto.latLong,
        results: {
          create: (searchResults.data || []).map((loc) => ({
            tripadvisorId: loc.location_id,
            name: loc.name,
            address: loc.address_obj?.address_string,
            latitude: loc.address_obj?.latitude ? parseFloat(String(loc.address_obj.latitude)) : null,
            longitude: loc.address_obj?.longitude ? parseFloat(String(loc.address_obj.longitude)) : null,
            rating: null,
            priceLevel: null,
            imageUrl: null,
          })),
        },
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        results: true,
      },
    });

    return {
      id: search.id,
      query: search.query,
      category: search.category,
      latLong: search.latLong,
      user: search.user,
      createdAt: search.createdAt,
      results: search.results,
    };
  }

  async updateGameStatus(
    userId: string,
    gameId: string,
    status: 'COMPLETED' | 'CANCELLED',
  ): Promise<GameDto> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.ownerId !== userId) {
      throw new ForbiddenException('Only game owner can update status');
    }

    if (game.status !== 'ACTIVE') {
      throw new BadRequestException('Game is already ' + game.status.toLowerCase());
    }

    const updated = await this.prisma.game.update({
      where: { id: gameId },
      data: { status },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        group: { select: { id: true, name: true } },
        _count: { select: { searches: true } },
      },
    });

    return {
      id: updated.id,
      status: updated.status,
      owner: updated.owner,
      group: updated.group,
      searchCount: updated._count.searches,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async deleteGame(userId: string, gameId: string): Promise<void> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.ownerId !== userId) {
      throw new ForbiddenException('Only game owner can delete the game');
    }

    await this.prisma.game.delete({
      where: { id: gameId },
    });
  }

  private checkGameAccess(
    userId: string,
    game: {
      ownerId: string;
      group?: { members: { userId: string }[] } | null;
    },
  ): boolean {
    // Owner always has access
    if (game.ownerId === userId) {
      return true;
    }

    // For group games, check if user is a member
    if (game.group) {
      return game.group.members.some((m) => m.userId === userId);
    }

    return false;
  }
}

