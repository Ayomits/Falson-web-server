import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guild } from './schemas/GuildSchema';
import { Cache } from '@nestjs/cache-manager';
import { GuildDto } from './dto/GuildDto';
import { LanguagesDto } from './dto/LanguageDto';
import { Response } from 'express';
import { SchemasName } from 'src/api/types';
import { AbstractService } from 'src/api/abstractions/AbstractService';
import { Excluder } from 'src/api/utils';

@Injectable()
export class GuildSettingsService extends AbstractService {
  constructor(
    @InjectModel(SchemasName.Guilds) private guildModel: Model<Guild>,
    private cacheManager: Cache,
  ) {
    super();
  }

  async findAll() {
    return await this.guildModel.find();
  }

  async findByGuildId(guildId: string, res?: Response): Promise<Guild> {
    const guildFromCache = (await this.cacheManager.get<Guild>(
      guildId,
    )) as Guild;
    if (guildFromCache) return guildFromCache;
    const guildFromDb = await this.fetchByGuildId(guildId);
    if (guildFromDb) await this.cacheManager.set(guildId, guildFromDb);
    return guildFromDb;
  }

  async insertMany(dto: any[]) {
    return await this.guildModel.insertMany(dto);
  }

  async fetchByGuildId(guildId: string) {
    return await this.guildModel.findOne({ guildId: guildId });
  }

  async create(dto: GuildDto) {
    const guild = await this.findByGuildId(dto.guildId);
    if (guild) throw new BadRequestException(`This guild already exists`);
    return await this.guildModel.create({ ...dto });
  }

  /**
   * Методы обновлений
   * Самое тяжелое
   */

  /**
   * Метод для занесения ролей
   * Помни, что это PUT соотвественно будет произведена полная замена
   * И не оглядывайся назад, сомневающийся Дима
   */

  async updateTrustedRoles(guildId: string, roles: string[]) {
    const guild = await this.findByGuildId(guildId);
    if (!guild) throw new BadRequestException(`This guild doesn't exists`);
    const newGuild = await this.guildModel.findByIdAndUpdate(
      guild._id,
      {
        $set: {
          trustedRoles: Excluder.excludeInvalidRoles(guildId ,roles)
        },
      },
      { new: true, upsert: true },
    );
    await this.cacheManager.set(guildId, newGuild);
    return newGuild;
  }

  async updateOne(guildId: string, dto: Partial<GuildDto>) {
    const guild = await this.findByGuildId(guildId);
    if (!guild) throw new BadRequestException(`This guild doesn't exists`);
    const newGuild = await this.guildModel.findByIdAndUpdate(
      guild._id,
      {
        $set: {
          ...dto,
        },
      },
      { new: true, upsert: true },
    );
    await this.cacheManager.set(guildId, newGuild);
    return newGuild;
  }

  async createOrUpdate(dto: GuildDto) {
    const guild = await this.findByGuildId(dto.guildId);
    if (guild) return this.updateOne(dto.guildId, {});
    return this.create(dto);
  }

  async updateLanguage(guildId: string, dto: LanguagesDto) {
    const guild = await this.findByGuildId(guildId);
    if (!guild) throw new BadRequestException(`This guild doesn't exists`);
    if (guild.interfaceLanguage === dto.interfaceLanguage)
      throw new BadRequestException(`Dto language is equal guild language`);
    return this.updateOne(guildId, {
      interfaceLanguage: dto.interfaceLanguage,
    });
  }

  async delete(guildId: string) {
    const guild = await this.findByGuildId(guildId);
    if (!guild) throw new BadRequestException(`This guild doesn't exists`);
    await this.cacheManager.del(guildId);
    await this.guildModel.deleteOne({ guildId });
    return { message: 'guild successfully deleted' };
  }
}
