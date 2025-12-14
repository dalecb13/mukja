import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { TripadvisorModule } from '../tripadvisor/tripadvisor.module';

@Module({
  imports: [TripadvisorModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}



