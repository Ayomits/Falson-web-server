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
import { MergedIsWhiteList } from '../../auth/guards';

@Controller(`verifications/tradition`)
@UseGuards(MergedIsWhiteList)
export class TraditionController {
  constructor(private traditionService: TraditionVerificationService) {}

  @Get(`:guildId`)
  getTraditionVerification(@Param(`guildId`) guildId: string) {
    return this.traditionService.findByGuildId(guildId);
  }

  @Post()
  createTraditionVerification(@Body() dto: TradionVerificationDto) {
    return this.traditionService.create(dto);
  }

  @Patch(`:guildId`)
  updateTradition(
    @Param(`guildId`) guildId: string,
    @Body() dto: TradionVerificationDto,
  ) {
    return this.traditionService.update(guildId, dto);
  }

  @Delete(`:guildId`)
  delete(@Param(`guildId`) guildId: string) {
    return this.traditionService.delete(guildId);
  }
}
