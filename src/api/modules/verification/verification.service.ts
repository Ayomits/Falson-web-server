import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateVerificationDto } from './verification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Verification } from './verification.schema';
import { Model } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs';
import { GuildsService } from '../guilds/guilds.service';
import {
  EmbedType,
  LanguagesEnum,
  PremiumEnum,
  validLanguages,
  VerificationType,
} from 'src/api/common/types/base.types';
import { defaultEmbeds } from 'src/api/common/types/defaultEmbeds';
@Injectable()
export class VerificationService {
  private clientFetcher: ClientFetcher = new ClientFetcher(client);
  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<Verification>,
    private cacheManager: Cache,
    @Inject(GuildsService) private guildService: GuildsService,
  ) {}
  /**
   *
   * Создание дефолтных настроек
   * Происходит в момент, когда к гильдии присоединяется бот
   */
  async createAllSettings(guildId: string, dto: CreateVerificationDto) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings) {
      throw new BadRequestException(`This settings already exists`);
    }
    const newSettings = await this.verificationModel.create({ ...dto });
    this.cacheManager.set(`verification-${guildId}`, newSettings);
    return newSettings;
  }

  async findAll() {
    return await this.verificationModel.find({});
  }

  async insertMany(dto: CreateVerificationDto[]) {
    return await this.verificationModel.insertMany(dto);
  }

  async fetchByGuildId(guildId: string) {
    return await this.verificationModel.findOne({ guildId: guildId });
  }
  /**
   * Поиск настроек для определенной гильдии
   * возвращает все!!
   */
  async findByGuildId(guildId: string): Promise<Verification> {
    const existedSettings = this.cacheManager.get(`verification-${guildId}`);
    if (existedSettings) {
      return existedSettings as unknown as Verification;
    }
    const existedSettingsFromDb = await this.fetchByGuildId(guildId);
    if (existedSettingsFromDb) {
      await this.cacheManager.set(
        `verification-${guildId}`,
        existedSettingsFromDb,
      );
    }
    return existedSettingsFromDb;
  }

  /**
   * Чистый update
   * @param guildId
   * @param newVerification
   */

  private async updateVerification(
    guildId: string,
    dto: Partial<CreateVerificationDto>,
  ) {
    const [settings] = await Promise.all([this.findByGuildId(guildId)]);
    const newVerification = await this.verificationModel
      .findByIdAndUpdate(
        (settings as any)._id,
        {
          $set: {
            ...dto,
            guildId: dto.guildId,
          },
        },
        { new: true },
      )
      .exec();
    await this.cacheManager.set(`verification-${guildId}`, newVerification);
    return newVerification;
  }

  async verificationTypeUpdate(
    guildId: string,
    dto: Partial<CreateVerificationDto['verificationType']>,
  ) {
    
    let verificationType: number;
    if (dto < VerificationType.Traditional) {
      verificationType = VerificationType.Traditional;
    }
    if (dto > VerificationType.Both) {
      verificationType = VerificationType.Both;
    }
    return this.updateVerification(guildId, {
      verificationType: verificationType,
    });
  }

  async updateVerificationRoles(guildId: string, roles: string[]) {
    if (roles.length > 25) {
      throw new BadRequestException(`Roles limit: 25`);
    }
    return await this.updateVerification(guildId, { verificationRoles: roles });
  }

  async premiumUpdateEmbeds(
    guildId: string,
    embeds: Partial<CreateVerificationDto['tradionVerificationEmbed']>,
  ) {
    if (embeds.length > 10) {
      throw new BadRequestException(`Embeds limit: 10`)
    }
    if (embeds.length < 1) {
      throw new BadRequestException(`Embeds minimum: 1`)
    }
    return this.updateVerification(guildId, {
      tradionVerificationEmbed: embeds,
    });
  }

  async defaultUpdateEmbeds(
    guildId: string,
    embed: Partial<CreateVerificationDto['tradionVerificationEmbed'][0]>,
  ) {
    if (this.isDefaultEmbed(embed)) {
      return await this.updateVerification(guildId, {
        tradionVerificationEmbed: [
          embed as CreateVerificationDto['tradionVerificationEmbed'][0],
        ],
      });
    }
    throw new BadRequestException(`You're not available this function`);
  }

  async updateLanguage(
    guildId: string,
    dto: Partial<CreateVerificationDto['language']>,
  ) {
    let language: string;
    if (!validLanguages.includes(dto)) {
      language = LanguagesEnum.Russian;
    }
    return this.updateVerification(guildId, { language: language });
  }

  async updateVerificationLogs(
    guildId: string,
    dto: Partial<CreateVerificationDto['verificationLogs']>,
  ) {
    return this.updateVerification(guildId, { verificationLogs: dto });
  }
  
  async voiceVerificationStaffRoles(
    guildId: string,
    dto: Partial<CreateVerificationDto['voiceVerificationStaffRoles']>,
  ) {
    return this.updateVerification(guildId, {
      voiceVerificationStaffRoles: dto,
    });
  }

  async voiceVerificationChannels(
    guildId: string,
    dto: Partial<CreateVerificationDto['voiceVerificationChannels']>,
  ) {
    return this.updateVerification(guildId, {
      voiceVerificationChannels:
        dto as CreateVerificationDto['voiceVerificationChannels'],
    });
  }

  async doubleVerification(
    guildId: string,
    dto: Partial<CreateVerificationDto['doubleVerification']>,
  ) {
    return this.updateVerification(guildId, { doubleVerification: dto });
  }

  async deleteVerification(guildId: string) {
    const existedSettings = (await this.findByGuildId(guildId)) as any;
    if (!existedSettings) {
      throw new BadRequestException(`This settings does'n exists`);
    }
    await Promise.all([
      await this.cacheManager.del(`verification-${guildId}`),
      await existedSettings.deleteOne(),
    ]);
    return;
  }

  private isDefaultEmbed(embed: any): boolean {
    return defaultEmbeds.some(
      (defaultEmbed) =>
        defaultEmbed.title === embed.title &&
        defaultEmbed.description === embed.description &&
        defaultEmbed.color === embed.color &&
        !embed.image &&
        !embed.author &&
        !embed.footer &&
        !embed.thumbnail,
    );
  }

}
