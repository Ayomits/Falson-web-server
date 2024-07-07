import { InjectModel } from '@nestjs/mongoose';
import { ClientFetcher, SchemasName } from 'src/api/common';
import { GuildPartner } from '../schemas/guild.schema';
import { Model } from 'mongoose';
import { GuildPartnerDto } from '../dto/guild.dto';
import { Cache } from '@nestjs/cache-manager';
import { client } from 'src/discordjs';
import { BadRequestException } from '@nestjs/common';

export class GuildPartnerService {
  constructor(
    @InjectModel(SchemasName.GuildPartner)
    private guildPartnerModel: Model<GuildPartner>,
    private cacheManager: Cache,
  ) {}

  private clientFetcher: ClientFetcher = new ClientFetcher(client);

  async findAll() {
    return await this.guildPartnerModel.find();
  }

  async verifyGuild(invite: string) {
    const guild = await this.clientFetcher.fetchGuildByInvite(invite);
    if (guild) {
      return guild.guild;
    }
    return null;
  }

  async fetchByGuildId(guildId: string) {
    return await this.guildPartnerModel.findOne({ guildId: guildId });
  }

  async findByGuildId(guildId: string) {
    const existed = this.cacheManager.get<GuildPartner>(`${guildId}-partner`);
    if (existed) return existed;
    const fetched = await this.fetchByGuildId(guildId);
    if (fetched) this.cacheManager.set(`${guildId}-partner`, fetched);
    return fetched;
  }

  async create(dto: GuildPartnerDto) {
    const existed = await this.findByGuildId(dto?.guildId);
    if (existed) throw new BadRequestException(`This partner already exists`);
    const verifiedGuild = await this.verifyGuild(dto.invite);
    if (verifiedGuild) {
      const newGuild = await this.guildPartnerModel.create({
        ...dto,
        guildId: dto.guildId ? dto.guildId : verifiedGuild.id,
      });
      this.cacheManager.set(`${verifiedGuild.id}-partner`, newGuild);
      return newGuild;
    }
    throw new BadRequestException(
      `This guild does not exists in discord (fetching by invite)`,
    );
  }

  async update(guildId: string, dto: GuildPartnerDto) {
    const existed = await this.findByGuildId(guildId);
    if (!existed) throw new BadRequestException(`This partner does not exists`);
    const updated = await this.guildPartnerModel.findByIdAndUpdate(
      existed._id,
      {
        ...dto,
        guildId: guildId,
      },
    );
    this.cacheManager.set(`${guildId}-partner`, updated);
    return updated;
  }

  async delete(guildId: string) {
    const existed = await this.findByGuildId(guildId);
    if (!existed) throw new BadRequestException(`This partner does not exists`);
    await this.guildPartnerModel.findByIdAndDelete(existed._id);
    this.cacheManager.del(`${guildId}-partner`);
    return { message: 'guild partner successfully deleted' };
  }
}
