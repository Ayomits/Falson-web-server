import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GeneralVerificationDto } from '../dto';
import { GeneralService } from '../services';
import { IsBotGuard, MergedIsWhiteList } from '../../../guards';

@Controller(`verifications/general`)
export class GeneralController {
  constructor(private generalService: GeneralService) {}

  @Get(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  getGeneral(@Param(`guildId`) guildId: string) {
    return this.generalService.findByGuildId(guildId);
  }

  @Post()
  @UseGuards(IsBotGuard)
  createGeneral(@Body() generalVerificationDto: GeneralVerificationDto) {
    return this.generalService.create(generalVerificationDto);
  }

  @Patch(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  updateGeneralVerification(
    @Param(`guildId`) guildId: string,
    @Body() dto: GeneralVerificationDto,
  ) { 
    return this.generalService.update(guildId, dto);
  }
}
