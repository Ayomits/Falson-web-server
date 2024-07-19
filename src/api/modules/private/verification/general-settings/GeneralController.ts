import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GeneralService } from './GeneralService';
import { GeneralVerificationDto } from './GeneralDto';

@Controller(`verifications/general`)
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
    @Param(`guildId`) guildId: string,
    @Body() dto: GeneralVerificationDto,
  ) {
    return this.generalService.update(guildId, dto);
  }
}
