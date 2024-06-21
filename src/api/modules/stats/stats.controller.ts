import { Controller, Inject } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {

  constructor(@Inject(StatsService) private statsService: StatsService) {}

  @Get("bot")
  /**
   * Статистика по боту
   */
  async botStats() {
    return await this.statsService.botStats()
  }
}
