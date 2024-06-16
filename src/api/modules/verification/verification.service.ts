import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  UpdateVerificationDto,
  CreateVerificationDto,
} from './verification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Verification } from './verification.schema';
import { Model, set } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs';
import { GuildsService } from '../guilds/guilds.service';
import { PremiumEnum, validLanguages } from 'src/api/common/types/base.types';
import { Guilds } from '../guilds/guilds.schema';
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

  async updateVerification(guildId: string, dto: CreateVerificationDto) {
    const [settings, guild] = await Promise.all([
      this.findByGuildId(guildId),
      this.guildService.findByGuildId(guildId),
    ]);
    if (!guild) {
      throw new BadRequestException(`Settings for this guild does not exists`);
    }
    if (dto.tradionVerificationEmbed.length >= 1) {
      const embeds = dto.tradionVerificationEmbed.slice(0, 10);
      if (dto.tradionVerificationEmbed.length > 10) {
        dto.tradionVerificationEmbed = embeds;
      }
      if ((guild as Guilds).premiumStatus < PremiumEnum.Donater) {
        dto.tradionVerificationEmbed = settings.tradionVerificationEmbed;
      } else {
        const sortedEmbed = embeds.filter((embed) =>
          this.isDefaultEmbed(embed),
        );
        if (sortedEmbed.length < 1) {
          dto.tradionVerificationEmbed = settings.tradionVerificationEmbed;
        } else {
          dto.tradionVerificationEmbed = sortedEmbed;
        }
      }
    }
    const newVerification = await this.verificationModel
      .findByIdAndUpdate(
        (settings as any)._id,
        {
          ...dto,
          guildId: dto.guildId,
        },
        { new: true },
      )
      .exec();
    await this.cacheManager.set(`verification-${guildId}`, newVerification);
    return newVerification;
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

  /**
   * Общий эндпоинт для всей верефки, определяет всё
   */
}
