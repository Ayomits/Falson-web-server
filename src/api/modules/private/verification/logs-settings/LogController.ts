import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { LogsDto } from './LogDto';
import { LogService } from './LogService';

@Controller('verifications/logs')
export class LogsController {
  constructor(private logService: LogService) {}

  @Get(`:guildId`)
  getLogsForGuild(@Param('guilId') guildId: string) {
    return this.logService.findByGuildId(guildId);
  }

  @Patch(`:guildId`)
  updateLogsForGuild(@Param('guilId') guildId: string, @Body() dto: LogsDto) {
    return this.logService.update(guildId, dto);
  }
}
