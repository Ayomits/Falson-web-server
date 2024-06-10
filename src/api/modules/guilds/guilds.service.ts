import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guilds } from './guilds.schema';
import { Model } from 'mongoose';

@Injectable()
export class GuildsService {
  constructor(@InjectModel(Guilds.name) private guildsModel: Model<Guilds>) {}

  async findAllUserGuilds() {}

  async findByGuildId(guildId: string) {
    return await this.guildsModel.findOne({ guildId: guildId });
  }
  async create(guild: Guilds) {
    const existedGuild = await this.findByGuildId(guild.guildId);
    if (existedGuild) {
      throw new BadRequestException(`This guild already exists`);
    }
    return await this.guildsModel.create(guild);
  }
  async findAll() {
    return await this.guildsModel.find();
  }
  async insertMany(docs: Guilds[]) {
    return await this.guildsModel.insertMany(docs);
  }
}
