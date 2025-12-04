import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TripadvisorController } from './tripadvisor.controller';
import { TripadvisorService } from './tripadvisor.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [TripadvisorController],
  providers: [TripadvisorService],
  exports: [TripadvisorService],
})
export class TripadvisorModule {}

