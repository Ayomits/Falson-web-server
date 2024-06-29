import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs/main';
import {
  JwtPayload,
  UserGuild,
  UserValidGuild,
} from 'src/api/common/types/base.types';
import { hasAdminPermission } from 'src/api/common/functions/isAdmin';

import axios from 'axios';
import { Request } from 'express';
import { SchemasName } from 'src/api/common';
import { UserType } from 'src/api/common/types/user';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  clientFetcher: ClientFetcher = new ClientFetcher(client);
  constructor(
    @InjectModel(SchemasName.Users) private userModel: Model<Users>,
    private cacheManager: Cache,
  ) {}

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
        this.cacheManager.set(`${userId}-guilds`, guilds, 10_000);
        return guilds;
      } catch {
        return this.findUserGuilds(userId, count + 1);
      }
    }
    throw new BadRequestException(`Discord rate limits`);
  }
  async ownersAndAdminsGuild(req: Request): Promise<UserValidGuild[]> {
    const user = req.user as JwtPayload;
    const cacheKey = `${user.userId}-guilds`;
    const cachedGuilds = await this.cacheManager.get<UserGuild[]>(cacheKey);
    const guilds =
      cachedGuilds || ((await this.findUserGuilds(user.userId)) as UserGuild[]);

    if (!guilds) {
      throw new BadRequestException(`This user has no guilds`);
    }

    const sortedGuilds = [];
    for await (const guild of guilds) {
      if (hasAdminPermission(guild.permissions) || guild.owner) {
        const guildFromCache = this.clientFetcher.getGuildFromCache(guild.id);
        if (!guildFromCache) {
          sortedGuilds.push({
            guildId: guild.id,
            icon: guild.icon,
            name: guild.name,
            invited: false,
          });
        } else {
          sortedGuilds.push({
            guildId: guild.id,
            icon: guild.icon,
            name: guildFromCache?.iconURL(),
            invited: true,
          });
        }
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
    const userFromCache = await this.cacheManager.get(userId);
    if (userFromCache) {
      return userFromCache;
    }
    const userFromDb = await this.fetchByUserId(userId);
    if (userFromDb) {
      await this.cacheManager.set(userId, userFromDb);
    }
    return userFromDb as unknown as Model<Users>;
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
    const existedUser = (await this.findByUserId(
      userSchema.userId,
    )) as Model<Users> & Users;
    if (existedUser) {
      return await this.userModel.findByIdAndUpdate(existedUser._id, {
        ...userSchema,
        userId: existedUser.userId,
        type: existedUser ? existedUser.type : UserType.everyone,
      });
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
        return await this.fetchUserData(newTokens);
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
      { new: true },
    );

    if (updatedUser) {
      await this.cacheManager.set(userId, updatedUser);
    }

    return updatedUser;
  }

  async deleteOne(userId: string) {
    const existedUser = await this.findByUserId(userId);
    if (!existedUser) throw new BadRequestException(`This user does not exist`);
    return await this.userModel.deleteOne({ userId: userId });
  }
  /**
   * Просто получает все сервера пользователя, где он админ или имеет право на редактирование панели
   * Будет использовано в гарде
   */
}
