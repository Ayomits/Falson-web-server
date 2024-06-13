import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  sendMessage(message: string) {
    console.log(message);
  }
  /**
   *
   * @param userSchema
   * @returns
   *
   * Модель юзера
   */
  async create(userSchema: Users) {
    const existedUser = await this.findByUserId(userSchema.userId);
    if (existedUser) throw new BadRequestException(`This user already exists`);
    return await this.userModel.create(userSchema);
  }
  async createOrUpdate(userSchema: Users) {
    const existedUser = await this.findByUserId(userSchema.userId);
    if (!existedUser) {
      return await this.create(userSchema)
    }else {
      return await this.updateOne(userSchema.userId, {...userSchema, balance: existedUser.balance})
    }
  }
  async findByUserId(userId: string) {
    return await this.userModel.findOne({ userId: userId });
  }
  async updateOne(userId: string, newSchema: Users) {
    const existedUser = await this.findByUserId(userId);
    if (!existedUser) throw new BadRequestException(`This user does not exist`);
    return await existedUser.updateOne({ userId: userId }, { ...newSchema });
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
  async fetchUserGuilds() {}
}
