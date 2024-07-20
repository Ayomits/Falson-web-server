import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AbstractController } from 'src/api/abstractions/AbstractController';
import { VoiceVerificationService } from './VoiceService';
import { VoiceVerificationDto } from './VoiceDto';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';
import { RouteType } from 'src/api/types/RouteType';

@Controller(`verifications/voice`)
export class VoiceController extends AbstractController {
  constructor(private voiceService: VoiceVerificationService) {
    super();
  }

  @Get(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  findByGuildId(@Param(`guildId`) guildId: string) {
    return this.voiceService.findByGuildId(guildId);
  }

  @Post()
  @RouteProtectLevel(RouteType.BOT_ONLY)
  create(@Body() dto: VoiceVerificationDto) {
    return this.voiceService.create(dto);
  }

  @Patch(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  update(@Param(`guildId`) guildId: string, @Body() dto: VoiceVerificationDto) {
    return this.voiceService.update(guildId, dto);
  }
}
