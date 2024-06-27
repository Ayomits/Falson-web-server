import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { GeneralVerificationDto } from '../dto';
import { GeneralService } from '../services';
import { MergedIsWhiteList } from '../../auth/guards';

@Controller(`verifications/general`)
@UseGuards(MergedIsWhiteList)
export class GeneralController {
  constructor(private generalService: GeneralService) {}

  @Get(`:guildId`)
  getGeneral(@Param(`guildId`) guildId: string) {
    return this.generalService.findByGuildId(guildId);
  }

  @Post()
  createGeneral(@Body() generalVerificationDto: GeneralVerificationDto) {
    return this.generalService.create(generalVerificationDto);
  }

  @Patch(`:guildId`)
  updateGeneralVerification(
    @Param(`:guildId`) guildId: string,
    @Body() dto: GeneralVerificationDto,
  ) {
    return this.generalService.update(guildId, dto);
  }
}
