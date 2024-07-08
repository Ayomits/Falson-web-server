import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { MergedIsWhiteList } from 'src/api/guards';
import { LogService } from '../services/logs.service';
import { LogsDto } from '../dto/logs.dto';

@Controller('verifications/logs')
export class LogsController {
  constructor(private logService: LogService) {}

  @Get(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  getLogsForGuild(@Param('guilId') guildId: string) {
    return this.logService.findByGuildId(guildId);
  }

  @Patch(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  updateLogsForGuild(@Param('guilId') guildId: string, @Body() dto: LogsDto) {
    return this.logService.update(guildId, dto);
  }
}
