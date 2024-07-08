import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GuildType, SchemasName } from 'src/api/common';
import { TradionVerification } from '../schemas';
import { TradionVerificationDto } from '../dto/tradition.dto';
import { GuildSettingsService } from '../../guild-settings/guild-settings.service';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class TraditionVerificationService {
  constructor(
    @InjectModel(SchemasName.TradionVerification)
    private traditionVerificationModel: Model<TradionVerification>,
    private guildService: GuildSettingsService,
    private cacheManager: Cache,
  ) {}

  async findByGuildId(guildId: string) {
    const cacheKey = `tradition_${guildId}`;
    const cacheVerification =
      await this.cacheManager.get<TradionVerification>(cacheKey);
    if (cacheVerification) return cacheVerification;
    const fetched = await this.fetchByGuildId(guildId);
    if (fetched) {
      await this.cacheManager.set(cacheKey, fetched);
      await this.cacheManager.set(fetched._id.toString(), fetched);
      return fetched;
    }
    return fetched;
  }

  async fetchByGuildId(guildId: string) {
    const existedSettings = await this.traditionVerificationModel.findOne({
      guildId,
    });
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    return existedSettings;
  }

  async findById(id: Types.ObjectId) {
    const cacheKey = id.toString();
    const cacheVerification =
      await this.cacheManager.get<TradionVerification>(cacheKey);
    if (cacheVerification) return cacheVerification;
    return await this.traditionVerificationModel.findById(id);
  }

  async create(dto: TradionVerificationDto) {
    const existedSettings = await this.traditionVerificationModel.findOne({
      guildId: dto.guildId,
    });
    const guild = await this.guildService.findByGuildId(dto.guildId);
    if (guild?.type < GuildType.Premium && dto.isDouble) {
      throw new BadRequestException(
        `isDouble parameter must be false, because this guild has not premium`,
      );
    }
    if (existedSettings)
      throw new BadRequestException(`This settings already exists`);
    const newVerification = await this.traditionVerificationModel.create(dto);
    await this.cacheManager.set(newVerification._id.toString(), newVerification);
    await this.cacheManager.set(`tradition_${dto.guildId}`, newVerification);
    return newVerification;
  }

  async update(guildId: string, dto: TradionVerificationDto) {
    const existedSettings = await this.traditionVerificationModel.findOne({
      guildId,
    });
    const guild = await this.guildService.findByGuildId(guildId);
    if (guild?.type < GuildType.Premium && dto.isDouble) {
      throw new BadRequestException(
        `isDouble parameter must be false, because this guild has not premium`,
      );
    }
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    const newVerification =
      await this.traditionVerificationModel.findByIdAndUpdate(
        existedSettings._id,
        { ...dto, guildId: guildId },
        { new: true, upsert: true },
      );
    await this.cacheManager.set(newVerification._id.toString(), newVerification);
    await this.cacheManager.set(`tradition_${guildId}`, newVerification);
    return newVerification;
  }

  async delete(guildId: string) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    await this.cacheManager.del(`tradition_${guildId}`);
    await this.cacheManager.del(existedSettings._id.toString());
    await this.traditionVerificationModel.deleteOne({ guildId });
    return { message: `successfully deleted` };
  }
}
