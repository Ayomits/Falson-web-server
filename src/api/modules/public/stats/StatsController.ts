import { Controller, Inject } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { StatsService } from './StatsService';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';
import { RouteType } from 'src/api/types/RouteType';

@Controller('stats')
export class StatsController {
  constructor(@Inject(StatsService) private statsService: StatsService) {}

  @Get('bot')
  @RouteProtectLevel(RouteType.PUBLIC)
  /**
   * Статистика по боту
   */
  botStats() {
    return this.statsService.botStats();
  }
}
