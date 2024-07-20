import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TradionVerificationDto } from './TraditionDto';
import { TraditionService } from './TraditionService';
import { RouteType } from 'src/api/types/RouteType';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';

@Controller(`verifications/tradition`)
export class TraditionController {
  constructor(private traditionService: TraditionService) {}

  @Get(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  getTraditionVerification(@Param(`guildId`) guildId: string) {
    return this.traditionService.findByGuildId(guildId);
  }

  @Post()
  @RouteProtectLevel(RouteType.BOT_ONLY)
  createTraditionVerification(@Body() dto: TradionVerificationDto) {
    return this.traditionService.create(dto);
  }

  @Patch(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  updateTradition(
    @Param(`guildId`) guildId: string,
    @Body() dto: TradionVerificationDto,
  ) {
    return this.traditionService.update(guildId, dto);
  }

  @Delete(`:guildId`)
  @RouteProtectLevel(RouteType.BOT_ONLY)
  delete(@Param(`guildId`) guildId: string) {
    return this.traditionService.delete(guildId);
  }
}
