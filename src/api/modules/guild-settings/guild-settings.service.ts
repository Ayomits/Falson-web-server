import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guild } from './schemas/guilds.schema';
import { Cache } from '@nestjs/cache-manager';
import { GuildDto } from './dto/guild.dto';
import { ClientFetcher, SchemasName } from 'src/api/common';
import { client } from 'src/discordjs/main';
import { LanguagesDto } from './dto/language.dto';

import { Response } from 'express';

@Injectable()
export class GuildSettingsService {
  private clientFetcher: ClientFetcher = new ClientFetcher(client);
  constructor(
    @InjectModel(SchemasName.Guilds) private guildModel: Model<Guild>,
    private cacheManager: Cache,
  ) {}

  async findAll() {
    return await this.guildModel.find();
  }

  async findByGuildId(guildId: string, res?: Response): Promise<Guild> {
    const guildFromCache = (await this.cacheManager.get<Guild>(
      guildId,
    )) as Guild;
    if (guildFromCache) return guildFromCache;
    const guildFromDb = await this.fetchByGuildId(guildId);
    if (guildFromDb) this.cacheManager.set(guildId, guildFromDb);
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
          trustedRoles: roles.filter((role) =>
            this.clientFetcher.getRoleFromCache(guildId, role),
          ),
        },
      },
      { new: true },
    );
    this.cacheManager.set(guildId, newGuild);
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
      { new: true },
    );
    this.cacheManager.set(guildId, newGuild);
    return newGuild;
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
    this.cacheManager.del(guildId)
    this.guildModel.deleteOne({ guildId });
    return [];
  }
}
