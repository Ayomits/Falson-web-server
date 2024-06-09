import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guilds } from './guilds.schema';
import { Model } from 'mongoose';

@Injectable()
export class GuildsService {
  constructor(@InjectModel(Guilds.name) private guildsModel: Model<Guilds>) {}

  async create() {}
  async findAll() {
    return await this.guildsModel.find()
  }
  async insertMany(docs: Guilds[]) {
    return await this.guildsModel.insertMany(docs)
  }
}
