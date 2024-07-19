import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AbstractController } from 'src/api/abstractions/AbstractController';
import { VoiceVerificationService } from './VoiceService';
import { VoiceVerificationDto } from './VoiceDto';

@Controller(`verifications/voice`)
export class VoiceController extends AbstractController {
  constructor(private voiceService: VoiceVerificationService) {
    super();
  }

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
