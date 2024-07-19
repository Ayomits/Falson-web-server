import { GeneralService } from './general-settings/GeneralService';
import { VoiceVerificationService } from './voice-settings/VoiceService';
import { plainToInstance } from 'class-transformer';
import { EmbedService } from './embeds-settings/EmbedService';
import { LogService } from './logs-settings/LogService';
import { TraditionService } from './tradition-settings/TraditionService';
import { Injectable } from '@nestjs/common';
import { Embed } from './embeds-settings/EmbedSchema';
import { TradionVerification } from './tradition-settings/TraditionSchema';
import { GeneralVerification } from './general-settings/GeneralSchema';
import { VoiceVerification } from './voice-settings/VoiceSchema';
import { Logs } from './logs-settings/LogSchema';

export class VerificationResponse {
  tradition: TradionVerification;
  embeds: Embed[];
  voice: VoiceVerification;
  general: GeneralVerification;
  logs: Logs;
}

@Injectable()
export class VerificationService {
  constructor(
    private embedService: EmbedService,
    private traditionService: TraditionService,
    private voiceService: VoiceVerificationService,
    private generalService: GeneralService,
    private logService: LogService,
  ) {}

  async createDefaultSettings(guildId: string) {
    const payload = { guildId };
    return await Promise.allSettled([
      this.generalService.create(payload),
      this.embedService.createIfNot(guildId),
      this.voiceService.create(payload),
      this.traditionService.create(payload),
      this.logService.create(payload),
    ]);
  }

  async allVerifications(guildId: string) {
    const [embeds, voice, general, tradition, logs] = await Promise.all([
      this.embedService.findByGuildId(guildId),
      this.voiceService.findByGuildId(guildId),
      this.generalService.findByGuildId(guildId),
      this.traditionService.findByGuildId(guildId),
      this.logService.findByGuildId(guildId),
    ]);
    const response = {
      tradition,
      embeds,
      voice,
      general,
      logs,
    };
    return plainToInstance(VerificationResponse, response);
  }
}
