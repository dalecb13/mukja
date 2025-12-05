import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TripadvisorModule } from './tripadvisor/tripadvisor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TripadvisorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

