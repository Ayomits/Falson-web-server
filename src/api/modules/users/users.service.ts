import { Injectable } from '@nestjs/common';
import { Users } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/api/common/types/base.types';

@Injectable()
export class UsersService {

  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async create(userSchema: UserDocument) {
    return await this.userModel.create(userSchema)
  }
  async findByUserId(userId: string) {
    return await this.userModel.findOne({userId: userId})
  }
  async updateOne(userId: string, newSchema: UserDocument) {
    return await this.userModel.updateOne({userId: userId}, {...newSchema})
  }
  async deleteOne(userId: string) {
    return await this.userModel.deleteOne({userId: userId})
  }
}
