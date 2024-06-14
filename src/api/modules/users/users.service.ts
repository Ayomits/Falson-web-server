import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    private cacheManager: Cache,
  ) {}
  /**
   *
   * @param userSchema
   * @returns
   *
   * Модель юзера
   */

  async findByUserId(userId: string) {
    const userFromCache = this.cacheManager.get(userId);
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
  async create(userSchema: Users) {
    const existedUser = await this.findByUserId(userSchema.userId);
    if (existedUser) throw new BadRequestException(`This user already exists`);
    return await this.userModel.create(userSchema);
  }
  /**
   * Для Аутентификации
   * Чтобы токены рефреш и акцесс менять
   * */
  async createOrUpdate(userSchema: Users) {
    const existedUser = await this.findByUserId(userSchema.userId);
    if (!existedUser) {
      return await this.create(userSchema);
    } else {
      return await this.updateOne(userSchema.userId, {
        ...userSchema,
        balance: (existedUser as any).balance,
      });
    }
  }

  async fetchAccessTokenByRefresh(refreshToken: string) {}

  async fetchUserData(accessToken: string, refreshToken: string) {}

  async fetchUserGuilds(accessToken: string, refreshToken: string) {}

  /**
   * Скорее всего юзнётся для обычного апдейта через аутентификацию
   * 
   */
  async updateOne(userId: string, newSchema: Users) {
    const existedUser = await this.findByUserId(userId);
    if (!existedUser) throw new BadRequestException(`This user does not exist`);
    return await (existedUser as any).updateOne({ userId: userId }, { ...newSchema });
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
