import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Embed as EmbedModel } from '../schemas';
import {
  defaultEmbeds,
  GuildType,
  SchemasName,
  validateProperties,
} from 'src/api/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthorDto, EmbedDto, FooterDto } from '../dto/embed.dto';
import { GuildSettingsService } from '../../guild-settings/guild-settings.service';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class EmbedService {
  constructor(
    @InjectModel(SchemasName.TradionEmbed)
    private embedModel: Model<EmbedModel>,
    private guildService: GuildSettingsService,
    private cacheManager: Cache,
  ) {}

  async findByGuildId(guildId: string) {
    const cacheKey = `embeds:${guildId}`;
    let embeds = await this.cacheManager.get<EmbedModel[]>(cacheKey);

    if (!embeds) {
      embeds = await this.embedModel
        .find({ guildId })
        .sort({ ['createdAt']: 1 });
      await this.cacheManager.set(cacheKey, embeds, 600_000);
    }

    return embeds;
  }

  async findById(id: Types.ObjectId) {
    const cacheKey = `embed:${id.toString()}`;
    let embed = await this.cacheManager.get<EmbedModel>(cacheKey);

    if (!embed) {
      embed = await this.embedModel.findById(id);
      await this.cacheManager.set(cacheKey, embed, 600_000);
    }

    return embed;
  }

  async findByIdAndGuildId(guildId: string, id: Types.ObjectId) {
    const cacheKey = `embed:${guildId}:${id.toString()}`;
    let embed = await this.cacheManager.get<EmbedModel>(cacheKey);

    if (!embed) {
      embed = await this.embedModel.findOne({ _id: id, guildId: guildId });
      await this.cacheManager.set(cacheKey, embed, 600_000);
    }

    return embed;
  }

  async create(guildId: string, dto: EmbedDto) {
    const guild = await this.guildService.findByGuildId(guildId);
    const cleanedDto = validateProperties<EmbedDto>(
      { author: AuthorDto, footer: FooterDto },
      dto,
      EmbedDto,
    );

    if (!this.isDefaultEmbed(dto) && guild.type < GuildType.Premium) {
      throw new ForbiddenException(`Missing access`);
    }

    const allEmbed = await this.findByGuildId(guildId);
    if (allEmbed.length + 1 > 25) {
      throw new BadRequestException(`Embed limit: 25`);
    }

    const newEmbed = await this.embedModel.create({
      ...cleanedDto,
      guildId: guildId,
    });

    await this.cacheManager.del(`embeds:${guildId}`);
    return newEmbed;
  }

  async createIfNot(guildId: string) {
    const cache = await this.cacheManager.get(`embeds:${guildId}`);
    if (cache) return false;
    const embeds = await this.findByGuildId(guildId);
    if (embeds.length > 0) return false;
    const newEmbed = await this.create(guildId, {
      guildId: guildId,
      ...defaultEmbeds[0],
    });
    return newEmbed;
  }

  async update(guildId: string, id: Types.ObjectId, dto: EmbedDto) {
    const guild = await this.guildService.findByGuildId(guildId);
    const cleanedDto = validateProperties<EmbedDto>(
      { author: AuthorDto, footer: FooterDto },
      dto,
      EmbedDto,
    );

    if (!this.isDefaultEmbed(cleanedDto) && guild.type < GuildType.Premium) {
      throw new ForbiddenException(`Missing access`);
    }

    const updatedEmbed = await this.embedModel.findByIdAndUpdate(
      id,
      { ...cleanedDto, guildId: guildId },
      { new: true, upsert: true },
    );

    await this.cacheManager.del(`embed:${guildId}:${id.toString()}`);
    await this.cacheManager.del(`embeds:${guildId}`);
    return updatedEmbed;
  }

  async delete(guildId: string, id: Types.ObjectId) {
    const embed = await this.findByIdAndGuildId(guildId, id);
    if (!embed) throw new BadRequestException(`This embed does not exist`);

    await embed.deleteOne();
    await this.cacheManager.del(`embed:${guildId}:${id.toString()}`);
    await this.cacheManager.del(`embeds:${guildId}`);
    return { message: 'Embed deleted successfully' };
  }

  private isDefaultEmbed(embed: any): boolean {
    return defaultEmbeds.some(
      (defaultEmbed) =>
        defaultEmbed.color === embed.color &&
        !embed.image &&
        !embed.author &&
        !embed.footer &&
        !embed.thumbnail,
    );
  }
}
