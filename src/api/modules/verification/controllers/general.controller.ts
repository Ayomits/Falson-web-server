import { Body, Controller, Get, Param, Patch, Put } from "@nestjs/common";
import { GeneralVerificationDto } from "../dto";
import { GeneralService } from "../services";

@Controller(`verifications/general`)
export class GeneralController {

  constructor(
    private generalService: GeneralService
  ) {}

  @Get(`:guildId`)
  getGenera(@Param(`guildId`) guildId: string) {
    return this.generalService.findByGuildId(guildId)
  }

  @Put(`:guildId`)
  updateGeneralVerification(
    @Param(`:guildId`) guildId: string,
    @Body() dto: GeneralVerificationDto
  ) {
    return this.generalService.update(guildId, dto)
  }
}