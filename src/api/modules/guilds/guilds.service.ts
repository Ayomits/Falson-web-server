import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guilds } from './guilds.schema';
import { Model } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import { PremiumEnum } from 'src/api/common/types/base.types';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs';

@Injectable()
export class GuildsService {
  clientFetch: ClientFetcher = new ClientFetcher(client);
  constructor(
    @InjectModel(Guilds.name) private guildsModel: Model<Guilds>,
    private cacheManager: Cache,
  ) {}

  async findByGuildId(guildId: string) {
    const guildFromCache = await this.cacheManager.get(guildId);
    if (guildFromCache) {
      return guildFromCache;
    }
    const guildFromDb = await this.guildsModel.findOne({ guildId: guildId });
    if (guildFromDb) {
      this.cacheManager.set(guildId, guildFromDb);
    }
    return guildFromDb;
  }
  async create(guild: Guilds) {
    const guildFromCache = await this.cacheManager.get(guild.guildId);
    if (guildFromCache) {
      throw new BadRequestException(`This guild already exists`);
    }
    const existedGuild = await this.findByGuildId(guild.guildId);
    if (existedGuild) {
      await this.cacheManager.set(guild.guildId, existedGuild);
      throw new BadRequestException(`This guild already exists`);
    }
    const newGuild = await this.guildsModel.create({
      ...guild,
      premiumStatus: PremiumEnum.NoPrem,
    });
    await this.cacheManager.set(guild.guildId, newGuild);
    return newGuild;
  }
  /**
   * НЕ кешируем
   * @returns
   */
  async findAll() {
    return await this.guildsModel.find();
  }
  async updateOne(guildId: string, newGuild: Guilds) {
    const existedGuild = await this.findByGuildId(guildId);
    if (!existedGuild) {
      throw new BadRequestException(`This guild does not exists`);
    }
    const updatedGuild = await this.guildsModel.updateOne(
      { guildId: guildId },
      { ...newGuild },
    );
    this.cacheManager.set(guildId, updatedGuild);
    return updatedGuild;
  }
  async insertMany(docs: Guilds[]) {
    return await this.guildsModel.insertMany(docs);
  }
  async deleteOne(guildId: string) {
    const existedGuild = await this.findByGuildId(guildId);
    if (!existedGuild) {
      throw new BadRequestException(`This guild does not exists`);
    }
    await this.guildsModel.deleteOne({ guildId: guildId });
    await this.cacheManager.del(guildId); // Удалить гильдию из кеша
    return;
  }

  async pushUser(guildId: string, users: string[]) {
    const existedGuild = (await this.findByGuildId(
      guildId,
    )) as unknown as Model<Guilds>;
    if (!existedGuild) {
      throw new BadRequestException(`This guild doesn't exists`);
    }
    const guild = this.clientFetch.getGuildFromCache(guildId);
    const sortedUsers = users.map((user) => {
      const userFromGuild = guild.members.cache.get(user);
      if (!userFromGuild) {
        return;
      }
      return userFromGuild.id;
    });
    const newGuild = await existedGuild.updateOne({
      $addToSet: { canUsePanel: sortedUsers },
    });
    await this.cacheManager.set(guildId, newGuild);
    return newGuild;
  }
}
