import { InjectModel } from '@nestjs/mongoose';
import { ClientFetcher, SchemasName } from 'src/api/common';
import { GuildPartner } from '../schemas/guild.schema';
import { Model } from 'mongoose';
import { GuildPartnerDto } from '../dto/guild.dto';
import { Cache } from '@nestjs/cache-manager';
import { client } from 'src/discordjs';

export class GuildPartnerService {
  constructor(
    @InjectModel(SchemasName.GuildPartner)
    private guildPartnerModel: Model<GuildPartner>,
    private cacheManager: Cache,
  ) {}

  private clientFetcher: ClientFetcher = new ClientFetcher(client);

  async findByGuildId(invite: string) {
    const guild = await this.clientFetcher.fetchGuildByInvite(invite);
    if (guild) {
      return guild.guild;
    }
  }

  async fetchByGuildId(guildId: string) {
    return await this.guildPartnerModel.findOne({ guildId: guildId });
  }

  async create(dto: GuildPartnerDto) {}
}
