import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guilds } from './guilds.schema';
import { Model } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import {
  BugHunterType,
  LanguagesType,
  PremiumEnum,
} from 'src/api/common/types/base.types';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs';
import { GuildDto } from './dto/guilds.dto';

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
    const guildFromDb = await this.fetchGuildByGuildId(guildId);
    if (guildFromDb) {
      await this.cacheManager.set(guildId, guildFromDb);
    }
    return guildFromDb as unknown as Guilds;
  }
  async fetchGuildByGuildId(guildId: string) {
    return await this.guildsModel.findOne({ guildId: guildId });
  }
  async create(guild: GuildDto) {
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
      canUsePanel: [],
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
    let premiumStatus;
    let bugHunter;
    /**
     * Тут говнокод на самом деле, но похуй
     * Мб позже исправлю
     * тех долг начинает расти эхх
     */
    if (newGuild.premiumStatus < PremiumEnum.NoPrem) {
      premiumStatus = PremiumEnum.NoPrem;
    }
    if (newGuild.premiumStatus > PremiumEnum.Sponsor) {
      premiumStatus = PremiumEnum.Sponsor;
    }
    if (newGuild.bugHunter < BugHunterType.NoBugHunter) {
      bugHunter = BugHunterType.NoBugHunter;
    }
    if (newGuild.bugHunter > BugHunterType.GoldBugHunter) {
      bugHunter = BugHunterType.GoldBugHunter;
    }
    const updatedGuild = await this.guildsModel.findOneAndUpdate(
      { guildId: guildId },
      {
        ...newGuild,
        premiumStatus: premiumStatus,
      },
    );
    await this.cacheManager.set(guildId, updatedGuild); // Обновляем кеш после обновления данных в базе данных
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

  private async getUsers(guildId: string, users: string[]) {
    const existedGuild = await this.findByGuildId(guildId);
    if (!existedGuild) {
      return null;
    }
    const guild = this.clientFetch.getGuildFromCache(guildId);
    const sortedUsers = users.map((user) => {
      const accesor =
        guild.members.cache.get(guildId) || guild.roles.cache.get(user);
      if (!accesor) return;
      return user;
    });
    return sortedUsers;
  }

  /**
   * Для @Put запроса
   * @param guildId
   * @param users
   * @returns
   */
  async setUsers(guildId: string, users: string[]) {
    const existedGuild = (await this.findByGuildId(
      guildId,
    )) as unknown as Model<Guilds>;
    if (!existedGuild) {
      throw new BadRequestException(`This guild doesn't exists`);
    }
    const guild = this.clientFetch.getGuildFromCache(guildId);
    const sortedUsers = users.map((role) => {
      const userFromGuild = guild.roles.cache.get(role);
      if (!userFromGuild) {
        return;
      }
      return userFromGuild.id;
    });
    await existedGuild.updateOne({
      $set: { canUsePanel: sortedUsers },
    });
    const newGuild = await this.fetchGuildByGuildId(guildId);
    await this.cacheManager.set(guildId, newGuild); // Обновляем кеш после обновления данных в базе данных
    return newGuild;
  }

  async addUser(guildId: string, users: string[]) {
    const getUsers = await this.getUsers(guildId, users);
    if (!getUsers) {
      throw new BadRequestException(
        `This guild doesn't exists or array of valid users and roles has 0 elements`,
      );
    }
    await this.guildsModel.updateOne({
      $addToSet: {
        canUsePanel: { $each: getUsers },
      },
    });
    const newGuild = await this.fetchGuildByGuildId(guildId);
    await this.cacheManager.set(guildId, newGuild);
    return newGuild;
  }

  async removeUsers(guildId: string, users: string[]) {
    const getUsers = await this.getUsers(guildId, users);
    if (!getUsers) {
      throw new BadRequestException(
        `This guild doesn't exists or array of valid users and roles has 0 elements`,
      );
    }
    await this.guildsModel.updateOne({
      $pullAll: {
        canUsePanel: { $each: getUsers },
      },
    });
    const newGuild = await this.fetchGuildByGuildId(guildId);
    await this.cacheManager.set(guildId, newGuild);
    return newGuild;
  }
}
