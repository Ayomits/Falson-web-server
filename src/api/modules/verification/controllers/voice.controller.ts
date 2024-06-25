import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { VoiceVerificationService } from '../services';
import { VoiceVerificationDto } from '../dto';

@Controller(`verifications/voice`)
export class VoiceController {
  constructor(private voiceService: VoiceVerificationService) {}

  @Get(`:guildId`)
  findByGuildId(@Param(`guildId`) guildId: string) {
    return this.voiceService.findByGuildId(guildId);
  }

  @Post()
  create(@Body() dto: VoiceVerificationDto) {
    return this.voiceService.create(dto);
  }

  @Patch(`:guildId`)
  update(@Param(`guildId`) guildId: string, @Body() dto: VoiceVerificationDto) {
    return this.voiceService.update(guildId, dto);
  }
}
