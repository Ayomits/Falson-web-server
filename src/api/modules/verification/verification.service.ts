import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Verification } from './schemas';
import { defaultEmbeds, SchemasName } from 'src/api/common';
import { EmbedService } from './services/embed.service';
import { GeneralService } from './services/general.service';
import { VoiceVerificationService } from './services/voice.service';
import { TraditionVerificationService } from './services/traditionVerification.service';
import { plainToInstance } from 'class-transformer';
import { VerificationResponse } from './dto/fullResponse.dto';
import { VerificationTypeDto } from './dto/verificationtype.dto';
import { Cache } from '@nestjs/cache-manager';
import { LogService } from './services/logs.service';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(SchemasName.AllVerifications)
    private verificationModel: Model<Verification>,

    private embedService: EmbedService,
    private traditionService: TraditionVerificationService,
    private voiceService: VoiceVerificationService,
    private generalService: GeneralService,
    private logService: LogService,

    private cacheManager: Cache,
  ) {}

  /**
   * Для каждого сервера дефолтные настройки
   */

  async findAll() {
    return await this.verificationModel.find();
  }

  async createDefaultSettings(guildId: string) {
    const existed = await this.findByGuildId(guildId);

    const results = await Promise.allSettled([
      this.embedService.createIfNot(guildId),
      this.traditionService.create({ guildId: guildId }),
      this.voiceService.create({ guildId: guildId }),
      this.generalService.create({ guildId: guildId }),
      this.logService.create({ guildId: guildId }),
    ]);

    const [_, traditionResult, voiceResult, generalResult, logsResult] =
      results;

    const traditionId =
      traditionResult.status === 'fulfilled'
        ? traditionResult.value._id
        : existed?.tradionVerification;
    const voiceId =
      voiceResult.status === 'fulfilled'
        ? voiceResult.value._id
        : existed?.voiceVerification;
    const generalId =
      generalResult.status === 'fulfilled'
        ? generalResult.value._id
        : existed?.generalVerification;
    const logsId =
      logsResult.status === 'fulfilled' ? logsResult.value._id : existed?.logs;

    if (existed) {
      return await this.verificationModel.updateOne(
        { guildId: guildId },
        {
          tradionVerification: traditionId,
          voiceVerification: voiceId,
          generalVerification: generalId,
          logs: logsId,
        },
      );
    } else {
      // Иначе создать новые настройки
      return await this.verificationModel.create({
        guildId: guildId,
        tradionVerification: traditionId,
        voiceVerification: voiceId,
        generalVerification: generalId,
        logs: logsId,
      });
    }
  }

  async findByGuildId(guildId: string) {
    const cacheKey = `verification_${guildId}`;
    return (
      (await this.cacheManager.get<Verification>(cacheKey)) ||
      (await this.verificationModel.findOne({ guildId: guildId }))
    );
  }

  async allVerifications(guildId: string) {
    const verification = await this.findByGuildId(guildId);
    if (!verification) throw new BadRequestException(`This settings not found`);
    const [embeds, voice, general, tradition, logs] = await Promise.all([
      this.embedService.findByGuildId(guildId),
      this.voiceService.findById(verification.voiceVerification),
      this.generalService.findById(verification.generalVerification),
      this.traditionService.findById(verification.tradionVerification),
      this.logService.findByGuildId(guildId),
    ]);
    const response = {
      tradition,
      embeds,
      voice,
      general,
      logs
    };

    return plainToInstance(VerificationResponse, response);
  }
}
