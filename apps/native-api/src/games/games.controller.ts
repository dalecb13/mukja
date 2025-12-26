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
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { SearchRestaurantsDto } from './dto/search-restaurants.dto';
import { UpdateGameStatusDto } from './dto/update-game-status.dto';
import { GameDto, GameDetailDto, GameSearchDto } from './dto/game-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Games')
@Controller('games')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game (solo or group)' })
  @ApiResponse({ status: 201, description: 'Game created', type: GameDto })
  @ApiResponse({ status: 403, description: 'Only group owner can start a group game' })
  async createGame(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateGameDto,
  ): Promise<GameDto> {
    return this.gamesService.createGame(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all games the user has access to' })
  @ApiResponse({ status: 200, description: 'List of games', type: [GameDto] })
  async getUserGames(@CurrentUser('id') userId: string): Promise<GameDto[]> {
    return this.gamesService.getUserGames(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get game details with all searches' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({ status: 200, description: 'Game details', type: GameDetailDto })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiResponse({ status: 403, description: 'No access to this game' })
  async getGameDetails(
    @CurrentUser('id') userId: string,
    @Param('id') gameId: string,
  ): Promise<GameDetailDto> {
    return this.gamesService.getGameDetails(userId, gameId);
  }

  @Post(':id/search')
  @ApiOperation({ summary: 'Search for restaurants and store results' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({ status: 201, description: 'Search completed', type: GameSearchDto })
  @ApiResponse({ status: 400, description: 'Game is not active' })
  @ApiResponse({ status: 403, description: 'No access to this game' })
  async searchRestaurants(
    @CurrentUser('id') userId: string,
    @Param('id') gameId: string,
    @Body() dto: SearchRestaurantsDto,
  ): Promise<GameSearchDto> {
    return this.gamesService.searchRestaurants(userId, gameId, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update game status (complete or cancel)' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({ status: 200, description: 'Status updated', type: GameDto })
  @ApiResponse({ status: 403, description: 'Only owner can update status' })
  async updateGameStatus(
    @CurrentUser('id') userId: string,
    @Param('id') gameId: string,
    @Body() dto: UpdateGameStatusDto,
  ): Promise<GameDto> {
    return this.gamesService.updateGameStatus(userId, gameId, dto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({ status: 204, description: 'Game deleted' })
  @ApiResponse({ status: 403, description: 'Only owner can delete' })
  async deleteGame(
    @CurrentUser('id') userId: string,
    @Param('id') gameId: string,
  ): Promise<void> {
    return this.gamesService.deleteGame(userId, gameId);
  }
}






