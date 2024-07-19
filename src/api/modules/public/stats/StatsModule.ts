import { Module } from '@nestjs/common';
import { StatsController } from './StatsController';
import { StatsService } from './StatsService';

@Module({
  controllers: [StatsController],
  providers: [StatsService]
})
export class StatsModule {}
