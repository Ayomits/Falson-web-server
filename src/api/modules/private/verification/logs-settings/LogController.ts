import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { LogsDto } from './LogDto';
import { LogService } from './LogService';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';
import { RouteType } from 'src/api/types/RouteType';

@Controller('verifications/logs')
export class LogsController {
  constructor(private logService: LogService) {}

  @Get(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)  
  getLogsForGuild(@Param('guilId') guildId: string) {
    return this.logService.findByGuildId(guildId);
  }

  @Patch(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  updateLogsForGuild(@Param('guilId') guildId: string, @Body() dto: LogsDto) {
    return this.logService.update(guildId, dto);
  }
}
