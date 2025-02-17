import { InjectModel } from '@nestjs/mongoose';
import { GeneralVerificationDto } from './GeneralDto';
import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { isArray } from 'class-validator';
import { AbstractService } from 'src/api/abstractions/AbstractService';
import { GuildSettingsService } from '../../guild-settings/GuildSettingsService';
import { GeneralVerification } from './GeneralSchema';
import { GuildType, SchemasName, VerificationType } from 'src/api/types';

@Injectable()
export class GeneralService extends AbstractService {

  constructor(
    @InjectModel(SchemasName.GeneralVerification)
    private generalVerification: Model<GeneralVerification>,
    private cacheManager: Cache,
    private guildService: GuildSettingsService,
  ) {
    super()
  }

  async findByGuildId(guildId: string) {
    const cacheKey = `general_${guildId}`;
    const cacheVerification =
      await this.cacheManager.get<GeneralVerification>(cacheKey);
    if (cacheVerification) {
      return cacheVerification;
    }
    const fetched = await this.fetchByGuildId(guildId);
    if (fetched) {
      await this.cacheManager.set(cacheKey, fetched);
      await this.cacheManager.set(fetched._id.toString(), fetched);
      return fetched;
    }
  }

  async fetchByGuildId(guildId: string) {
    const result = await this.generalVerification.findOne({ guildId: guildId });
    return result;
  }

  async findById(id: Types.ObjectId) {
    const cacheKey = id.toString();
    const cacheVerification =
      await this.cacheManager.get<GeneralVerification>(cacheKey);
    if (cacheVerification) return cacheVerification;
    return await this.generalVerification.findById(id);
  }

  async create(dto: GeneralVerificationDto) {
    const existedSettings = await this.findByGuildId(dto.guildId);
    if (existedSettings)
      throw new BadRequestException(`This settings already exists`);
    const newVerification = await this.generalVerification.create(dto);
    await this.cacheManager.set(
      newVerification._id.toString(),
      newVerification,
    );
    await this.cacheManager.set(`general_${dto.guildId}`, newVerification);
    return newVerification;
  }

  async update(guildId: string, dto: GeneralVerificationDto) {
    const existedSettings = await this.findByGuildId(guildId);
    const guild = await this.guildService.findByGuildId(guildId);

    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    if (dto.type >= VerificationType.Both && guild?.type < GuildType.Premium)
      throw new ForbiddenException(`This guild cannot do this`);
    const res = {};

    Object.keys(dto).forEach((key) => {
      try {
        if (dto[key] !== undefined) {
          if (isArray(dto[key])) {
            res[key] = dto[key].filter(
              async (item) => await this.clientFetcher.fetchRole(guildId, item),
            );
            return;
          }
          res[key] = dto[key];
          return;
        }
      } catch {}
    });
    const newVerification = await this.generalVerification.findByIdAndUpdate(
      existedSettings._id,
      { ...(res as any), guildId: guildId },
      { new: true, upsert: true },
    );

    await this.cacheManager.set(
      newVerification._id.toString(),
      newVerification,
    );
    await this.cacheManager.set(`general_${guildId}`, newVerification);
    return newVerification;
  }

  async createOrUpdate(guildId: string) {
    const existed = await this.findByGuildId(guildId);
    if (existed) return this.update(guildId, { guildId: guildId });
    return this.create({ guildId: guildId });
  }

  async delete(guildId: string) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    await this.cacheManager.del(`general_${guildId}`);
    await this.cacheManager.del(existedSettings._id.toString());
    this.generalVerification.findByIdAndDelete(existedSettings._id);
    return { message: `succesfully deleted` };
  }
}
