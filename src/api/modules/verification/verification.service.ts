import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { defaultEmbeds, SchemasName } from 'src/api/common';
import { EmbedService } from './services/embed.service';
import { GeneralService } from './services/general.service';
import { VoiceVerificationService } from './services/voice.service';
import { TraditionVerificationService } from './services/traditionVerification.service';
import { plainToInstance } from 'class-transformer';
import { VerificationTypeDto } from './dto/verificationtype.dto';
import { Cache } from '@nestjs/cache-manager';
import { LogService } from './services/logs.service';
import { VerificationResponse } from './dto/VerificationResponse';

@Injectable()
export class VerificationService {
  constructor(
    private embedService: EmbedService,
    private traditionService: TraditionVerificationService,
    private voiceService: VoiceVerificationService,
    private generalService: GeneralService,
    private logService: LogService,
  ) {}

  async createDefaultSettings(guildId: string) {
    const payload = {guildId}
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
