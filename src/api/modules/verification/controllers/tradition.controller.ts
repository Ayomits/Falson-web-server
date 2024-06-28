import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TraditionVerificationService } from '../services';
import { TradionVerificationDto } from '../dto';
import { IsBotGuard, MergedIsWhiteList } from '../../../guards';

@Controller(`verifications/tradition`)

export class TraditionController {
  constructor(private traditionService: TraditionVerificationService) {}

  @Get(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  getTraditionVerification(@Param(`guildId`) guildId: string) {
    return this.traditionService.findByGuildId(guildId);
  }

  @Post()
  @UseGuards(IsBotGuard)
  createTraditionVerification(@Body() dto: TradionVerificationDto) {
    return this.traditionService.create(dto);
  }

  @Patch(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  updateTradition(
    @Param(`guildId`) guildId: string,
    @Body() dto: TradionVerificationDto,
  ) {
    return this.traditionService.update(guildId, dto);
  }

  @Delete(`:guildId`)
  @UseGuards(IsBotGuard)
  delete(@Param(`guildId`) guildId: string) {
    return this.traditionService.delete(guildId);
  }
}
