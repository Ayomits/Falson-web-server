import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateVerificationDto,
  EmbedDto,
  SubChannelDto,
  SubChannelsDto,
  SubRolesDto,
  VerificationLogsDto,
  VoiceVerificationStaffRolesDto,
} from './verification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Verification } from './verification.schema';
import { Model } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs';
import { GuildSettingsService } from '../guilds-settings/guilds.service';
import {
  LanguagesEnum,
  validLanguages,
  VerificationType,
} from 'src/api/common/types/base.types';
import { defaultEmbeds } from 'src/api/common/types/defaultEmbeds';
import { clearUsedFields, validateProperties } from 'src/api/common/functions/validateProperties';
import _, { set } from 'lodash';

@Injectable()
export class VerificationService {
  private clientFetcher: ClientFetcher = new ClientFetcher(client);
  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<Verification>,
    private cacheManager: Cache,
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
    const existedSettings = await this.cacheManager.get(
      `verification-${guildId}`,
    );
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
    const transormatedDto = validateProperties<CreateVerificationDto>(
      {
        voiceVerificationStaffRoles: SubRolesDto,
        verificationLogs: SubChannelDto,
        tradionVerificationEmbed: EmbedDto,
        voiceVerificationChannels: SubChannelsDto,
      },
      dto,
      CreateVerificationDto,
    ) as any;
    const [settings] = (await Promise.all([
      this.findByGuildId(guildId),
    ])) as any;
    const cleared = clearUsedFields(transormatedDto, settings)
    const newVerification = await this.verificationModel
      .findByIdAndUpdate(
        (settings as any)._id,
        {
          ...cleared,
          guildId: dto.guildId,
        },
        {new: true}
      )
      .exec();
    await this.cacheManager.set(`verification-${guildId}`, newVerification);
    return newVerification;
  }

  async verificationTypeUpdate(
    guildId: string,
    dto: Partial<CreateVerificationDto>,
  ) {
    let verificationType: number = dto.verificationType;
    if (dto.verificationType < VerificationType.Traditional) {
      verificationType = VerificationType.Traditional;
    }
    if (dto.verificationType > VerificationType.Both) {
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
    embeds: Partial<CreateVerificationDto>,
  ) {
    if (!embeds.tradionVerificationEmbed) {
      throw new BadRequestException(`Embeds minimum: 1`);
    }
    if (embeds?.tradionVerificationEmbed.length > 10) {
      throw new BadRequestException(`Embeds limit: 10`);
    }
    if (embeds?.tradionVerificationEmbed.length < 1) {
      throw new BadRequestException(`Embeds minimum: 1`);
    }
    return this.updateVerification(guildId, {
      tradionVerificationEmbed: embeds?.tradionVerificationEmbed,
    });
  }

  async defaultUpdateEmbeds(
    guildId: string,
    embed: Partial<CreateVerificationDto>,
  ) {
    if (this.isDefaultEmbed(embed.tradionVerificationEmbed[0])) {
      return await this.updateVerification(guildId, {
        tradionVerificationEmbed: [embed.tradionVerificationEmbed[0]],
      });
    }
    throw new BadRequestException(`You're not available this function`);
  }

  async updateLanguage(guildId: string, dto: Partial<CreateVerificationDto>) {
    let language: string = dto.language;
    if (!validLanguages.includes(dto.language)) {
      language = LanguagesEnum.Russian;
    }
    return this.updateVerification(guildId, { language: language });
  }

  async updateVerificationLogs(
    guildId: string,
    dto: Partial<CreateVerificationDto>,
  ) {
    return this.updateVerification(guildId, {
      verificationLogs: dto.verificationLogs,
    });
  }

  async voiceVerificationStaffRoles(
    guildId: string,
    dto: Partial<CreateVerificationDto>,
  ) {
    return this.updateVerification(guildId, {
      voiceVerificationStaffRoles: dto.voiceVerificationStaffRoles,
    });
  }

  async voiceVerificationChannels(
    guildId: string,
    dto: Partial<CreateVerificationDto>,
  ) {
    return this.updateVerification(guildId, {
      voiceVerificationChannels: dto.voiceVerificationChannels,
    });
  }

  async doubleVerification(
    guildId: string,
    dto: Partial<CreateVerificationDto>,
  ) {
    return this.updateVerification(guildId, {
      doubleVerification: dto.doubleVerification,
    });
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
