import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GeneralService } from './GeneralService';
import { GeneralVerificationDto } from './GeneralDto';
import { RouteType } from 'src/api/types/RouteType';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';

@Controller(`verifications/general`)
export class GeneralController {
  constructor(private generalService: GeneralService) {}

  @Get(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  getGeneral(@Param(`guildId`) guildId: string) {
    return this.generalService.findByGuildId(guildId);
  }

  @Post()
  @RouteProtectLevel(RouteType.BOT_ONLY)
  createGeneral(@Body() generalVerificationDto: GeneralVerificationDto) {
    return this.generalService.create(generalVerificationDto);
  }

  @Patch(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  updateGeneralVerification(
    @Param(`guildId`) guildId: string,
    @Body() dto: GeneralVerificationDto,
  ) {
    return this.generalService.update(guildId, dto);
  }
}
