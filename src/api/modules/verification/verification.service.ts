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
  async findByGuildId(guildId: string): Promise<Model<Verification>> {
    const existedSettings = this.cacheManager.get(`verification-${guildId}`);
    if (existedSettings) {
      return existedSettings as unknown as Model<Verification>;
    }
    const existedSettingsFromDb = await this.fetchByGuildId(guildId);
    if (existedSettingsFromDb) {
      await this.cacheManager.set(
        `verification-${guildId}`,
        existedSettingsFromDb,
      );
    }
    return existedSettingsFromDb as unknown as Model<Verification>;
  }

  /**
   * Чистый update
   * @param guildId
   * @param newVerification
   */

  async deleteVerification(guildId: string) {
    const existedSettings = await this.findByGuildId(guildId);
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
  async updateVerification(guildId: string, dto: Partial<Verification>) {
    const verification = await this.findByGuildId(guildId);
    if (!verification) {
      throw new BadRequestException(
        `Verification for guild ${guildId} not found`,
      );
    }
    await this.verificationModel.updateOne({ ...dto, guildId: guildId });
    const newVerification = await this.fetchByGuildId(guildId);
    await this.cacheManager.set(`verification-${guildId}`, newVerification);
    return newVerification;
  }
}
