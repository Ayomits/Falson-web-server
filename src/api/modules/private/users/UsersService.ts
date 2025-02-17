import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from './schemas/UserSchema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import axios from 'axios';
import { Request } from 'express';
import { UserDto } from './dto/UserDto';
import { AbstractService } from 'src/api/abstractions/AbstractService';
import {
  JwtPayload,
  SchemasName,
  UserGuild,
  UserValidGuild,
} from 'src/api/types';
import { hasAdminPermission } from 'src/api/utils';
import { UserType } from 'src/api/types/User';
import { AuthorizedRequest } from 'src/api/types/AuthorizedRequest';

@Injectable()
export class UsersService extends AbstractService {
  constructor(
    @InjectModel(SchemasName.Users) private userModel: Model<Users>,
    private cacheManager: Cache,
  ) {
    super();
  }

  async findByToken(token: string) {
    return await this.userModel.findOne({ refreshToken: token });
  }

  async findUserData(userId: string) {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new BadRequestException(`This user doesn't exists`);
    }
    return await this.fetchUserData({
      accessToken: (user as any).tokens.accessToken,
      refreshToken: (user as any).tokens.refreshToken,
    });
  }

  async findUser(userId: string) {
    const user = (await this.findByUserId(userId)) as Users;

    // Деструктурируем данные пользователя
    if (user) {
      const { userId, tokens, createdAt } = user;
      return {
        userId,
        tokens,
        createdAt,
      };
    }
    throw new BadRequestException(`This user doesn't exists`);
  }

  async findUserGuilds(
    userId: string,
    count: number = 0,
  ): Promise<UserGuild[]> {
    const user = (await this.findByUserId(userId)) as Users;
    if (!user) {
      throw new BadRequestException(`This user doesn't exists`);
    }
    const { accessToken, refreshToken } = user.tokens;
    if (count < 3) {
      try {
        const guildFromCache = (await this.cacheManager.get(
          `${userId}-guilds`,
        )) as UserGuild[];
        if (guildFromCache) {
          return guildFromCache;
        }
        const guilds = await this.fetchUserGuilds(userId, {
          accessToken,
          refreshToken,
        });
        return guilds;
      } catch {
        return this.findUserGuilds(userId, count + 1);
      }
    }
    throw new BadRequestException(`Discord rate limits`);
  }
  async ownersAndAdminsGuild(
    req: AuthorizedRequest,
  ): Promise<UserValidGuild[]> {
    const user = req.user;
    const guilds = (await this.findUserGuilds(user.userId)) as UserGuild[];

    if (!guilds) {
      throw new BadRequestException(`This user has no guilds`);
    }

    const sortedGuilds = [];
    for await (const guild of guilds) {
      if (hasAdminPermission(guild.permissions) || guild.owner) {
        const guildFromCache = this.clientFetcher.getGuildFromCache(guild.id);
        const iconUrl = `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.png`;
        sortedGuilds.push({
          guildId: guild.id,
          icon: iconUrl.includes('undefined') || iconUrl.includes("null") ? null : iconUrl,
          name: guild.name,
          memberCount: guildFromCache ? guildFromCache.memberCount : null,
          invited: !!guildFromCache,
          banner: guildFromCache ? guildFromCache.bannerURL() : null,
        });
      }
    }

    return sortedGuilds;
  }

  async fetchUserGuilds(
    userId: string,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    try {
      const headers = {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      };

      const query = await axios.get(
        'https://discord.com/api/users/@me/guilds',
        { headers },
      );
      return query.data;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Access token is invalid or expired, refresh it
        const newTokens = await this.fetchAccessTokenByRefresh(
          tokens.refreshToken,
        );

        return await Promise.all([
          await this.userModel.updateOne({
            userId: userId,
            tokens: {
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
            },
          }),
          this.fetchUserGuilds(userId, newTokens),
        ]);
      }
      throw new BadRequestException(err.message);
    }
  }

  /**
   *
   * @param userSchema
   * @returns
   *
   * Модель юзера
   */

  async findByUserId(userId: string) {
    const userFromCache = await this.cacheManager.get<Users>(userId);
    if (userFromCache) {
      return userFromCache;
    }
    const userFromDb = await this.fetchByUserId(userId);
    if (userFromDb) {
      await this.cacheManager.set(userId, userFromDb);
    }
    return userFromDb;
  }
  /**
   *
   * Обычный поиск
   *
   */
  async fetchByUserId(userId: string) {
    return await this.userModel.findOne({ userId: userId });
  }
  /**
   * Общий метод
   * @param userSchema
   * @returns
   */
  async create(userSchema: UserDto) {
    const existedUser = await this.findByUserId(userSchema.userId);
    if (existedUser) throw new BadRequestException(`This user already exists`);
    return await this.userModel.create(userSchema);
  }
  /**
   * Для Аутентификации
   * Чтобы токены рефреш и акцесс менять
   * */
  async createOrUpdate(userSchema: UserDto) {
    const existedUser = await this.findByUserId(userSchema.userId);
    if (existedUser) {
      const newUser = await this.updateOne(userSchema.userId, {
        ...userSchema,
        userId: existedUser.userId,
        type: existedUser ? existedUser.type : UserType.everyone,
      });
      return newUser;
    } else {
      return await this.create({ ...userSchema, type: UserType.everyone });
    }
  }

  async fetchAccessTokenByRefresh(refreshToken: string) {
    try {
      const response = await axios.post(
        'https://discord.com/api/oauth2/token',
        null,
        {
          params: {
            client_id: this.clientFetcher.client,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
    } catch (err) {
      throw new BadRequestException(
        `Failed to refresh access token: ${err.message}`,
      );
    }
  }
  async fetchUserData(tokens: { accessToken: string; refreshToken: string }) {
    try {
      const headers = {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      };

      const query = await axios.get('https://discord.com/api/users/@me', {
        headers,
      });
      return query.data;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newTokens = await this.fetchAccessTokenByRefresh(
          tokens.refreshToken,
        );
        return this.fetchUserData(newTokens);
      }
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Скорее всего юзнётся для обычного апдейта через аутентификацию
   *
   */
  async updateOne(userId: string, newSchema: Partial<Users>) {
    const existedUser = await this.findByUserId(userId);
    if (!existedUser) throw new BadRequestException(`This user does not exist`);

    const updatedUser = await this.userModel.findOneAndUpdate(
      { userId: userId },
      { $set: newSchema },
      { new: true, upsert: true },
    );

    await this.cacheManager.set(userId, updatedUser);

    return updatedUser;
  }

  async deleteOne(userId: string) {
    const existedUser = await this.findByUserId(userId);
    if (!existedUser) throw new BadRequestException(`This user does not exist`);
    await this.cacheManager.del(userId);
    return await this.userModel.deleteOne({ userId: userId });
  }
  /**
   * Просто получает все сервера пользователя, где он админ или имеет право на редактирование панели
   * Будет использовано в гарде
   */
}
