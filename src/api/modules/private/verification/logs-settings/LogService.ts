import { Cache } from '@nestjs/cache-manager';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Logs } from './LogSchema';
import { InjectModel } from '@nestjs/mongoose';
import { LogsDto } from './LogDto';
import { SchemasName } from 'src/api/types';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(SchemasName.VerificationLogs) private logModel: Model<Logs>,
    private cacheManager: Cache,
  ) {}

  async findByGuildId(guildId: string) {
    const logFromCache = await this.cacheManager.get<Logs>(`${guildId}-logs`);
    if (logFromCache) return logFromCache;
    const fetched = await this.fetchByGuildId(guildId);
    if (fetched) await this.cacheManager.set(`${guildId}-logs`, fetched);
    return fetched;
  }

  async fetchByGuildId(guildId: string) {
    return await this.logModel.findOne({ guildId });
  }

  async create(dto: LogsDto) {
    const existed = await this.findByGuildId(dto.guildId);
    if (existed) {
      throw new BadRequestException(`This settings already exists`);
    }
    const newLogs = await this.logModel.create(dto);
    await this.cacheManager.set(`${dto.guildId}-logs`, newLogs);
    return newLogs;
  }

  async update(guildId: string, dto: LogsDto) {
    const existed = await this.findByGuildId(guildId);
    if (!existed) {
      throw new BadRequestException(`This settings does not exists`);
    }
    const updated = await this.logModel.findOneAndUpdate(existed._id, dto, {
      new: true,
      upsert: true,
    });
    await this.cacheManager.set(`${guildId}-logs`, updated);
    return updated;
  }

  async createOrUpdate(guildId: string) {
    const existed = await this.findByGuildId(guildId);
    if (existed) return await this.update(guildId, { guildId: guildId });
    return await this.create({ guildId: guildId });
  }
}
