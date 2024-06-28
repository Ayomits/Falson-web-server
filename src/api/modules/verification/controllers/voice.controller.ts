import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VoiceVerificationService } from '../services';
import { VoiceVerificationDto } from '../dto';
import { IsBotGuard, MergedIsWhiteList } from '../../../guards';

@Controller(`verifications/voice`)
export class VoiceController {
  constructor(private voiceService: VoiceVerificationService) {}

  @Get(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  findByGuildId(@Param(`guildId`) guildId: string) {
    return this.voiceService.findByGuildId(guildId);
  }

  @Post()
  @UseGuards(IsBotGuard)
  create(@Body() dto: VoiceVerificationDto) {
    return this.voiceService.create(dto);
  }

  @Patch(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  update(@Param(`guildId`) guildId: string, @Body() dto: VoiceVerificationDto) {
    return this.voiceService.update(guildId, dto);
  }
}
