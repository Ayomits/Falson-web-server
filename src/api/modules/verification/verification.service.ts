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

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(SchemasName.AllVerifications)
    private verificationModel: Model<Verification>,

    private embedService: EmbedService,
    private traditionService: TraditionVerificationService,
    private voiceService: VoiceVerificationService,
    private generalService: GeneralService,
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
    if (existed) throw new BadRequestException(`This settings already exists`);
    const [_, tradition, voice, general] = await Promise.all([
      this.embedService.create(guildId, {
        ...defaultEmbeds[0],
        guildId: guildId,
      }),
      this.traditionService.create({ guildId: guildId }),
      this.voiceService.create({ guildId: guildId }),
      this.generalService.create({ guildId: guildId }),
    ]);
    return await this.verificationModel.create({
      guildId: guildId,
      voiceVerification: voice?._id,
      tradionVerification: tradition?._id,
      generalVerification: general?._id,
    });
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
    const [embeds, voice, general, tradition] = await Promise.all([
      this.embedService.findByGuildId(guildId),
      this.voiceService.findById(verification.voiceVerification),
      this.generalService.findById(verification.generalVerification),
      this.traditionService.findById(verification.tradionVerification),
    ]);
    const response = {
      tradition,
      embeds,
      voice,
      general,
    };

    return plainToInstance(VerificationResponse, response);
  }

  async updateVerificationType(guildId: string, dto: VerificationTypeDto) {
    const guild = await this.findByGuildId(guildId);
    if (!guild)
      throw new BadRequestException(`Settings for this guild does not exists`);
    const newVerification = await this.verificationModel.findByIdAndUpdate(
      guild._id,
      {
        ...dto,
      },
      { new: true },
    );
    await this.cacheManager.set(newVerification._id.toString(), newVerification);
    return newVerification;
  }
}
