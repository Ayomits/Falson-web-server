import { BadRequestException, Injectable } from '@nestjs/common';
import {
  UpdateVerificationDto,
  CreateVerificationDto,
} from './verification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Verification } from './verification.schema';
import { Model } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
@Injectable()
export class VerificationService {
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

  /**
   * Поиск настроек для определенной гильдии
   * возвращает все!!
   */
  async findByGuildId(guildId: string): Promise<Model<Verification>> {
    const existedSettings = this.cacheManager.get(`verification-${guildId}`);
    if (existedSettings) {
      return existedSettings as unknown as Model<Verification>;
    }
    const existedSettingsFromDb = await this.verificationModel.findOne({
      guildId: guildId,
    });
    if (existedSettingsFromDb) {
      this.cacheManager.set(`verification-${guildId}`, existedSettingsFromDb);
    }
    return existedSettingsFromDb as unknown as Model<Verification>;
  }

  /**
   * Чистый update
   * @param guildId
   * @param newVerification
   */
  async changeVerification(
    newVerification: UpdateVerificationDto,
  ) {
    const existedSettings = await this.findByGuildId(newVerification.guildId);
    if (!existedSettings) {
      throw new BadRequestException(`Settings for this guild does not exists`);
    }
    const newSettings = await existedSettings?.updateOne({
      ...newVerification,
    });
    this.cacheManager.set(`verification-${newVerification.guildId}`, newSettings);
    return newSettings;
  }

  async deleteVerification(guildId: string) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings) {
      throw new BadRequestException(`This settings does'n exists`);
    }
    await Promise.all([
      this.cacheManager.del(`verification-${guildId}`),
      await existedSettings.deleteOne(),
    ]);
    return null;
  }
}
