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

@Injectable()
export class EmbedService {
  constructor(
    @InjectModel(SchemasName.TradionEmbed)
    private embedModel: Model<EmbedModel>,
    private guildService: GuildSettingsService,
  ) {}

  async findByGuildId(guildId: string) {
    return await this.embedModel.find({ guildId });
  }

  async findById(id: Types.ObjectId) {
    return await this.embedModel.findById(id);
  }

  async findByIdAndGuildId(guildId: string, id: Types.ObjectId) {
    return await this.embedModel.findOne({ _id: id, guildId: guildId });
  }

  async create(guildId: string, dto: EmbedDto) {
    const guild = await this.guildService.findByGuildId(guildId);
    const cleanedDto = validateProperties<EmbedDto>(
      { author: AuthorDto, footer: FooterDto },
      dto,
      EmbedDto,
    );
    if (!this.isDefaultEmbed(dto)) {
      if (guild.type < GuildType.Premium)
        throw new ForbiddenException(`Missing access`);
    }
    const allEmbed = await this.findByGuildId(guildId);
    if (allEmbed.length + 1 > 25) {
      throw new BadRequestException(`Embed limit: 25`);
    }
    return await this.embedModel.create({ ...cleanedDto, guildId: guildId });
  }

  async update(guildId: string, id: Types.ObjectId, dto: EmbedDto) {
    const guild = await this.guildService.findByGuildId(guildId);
    const cleanedDto = validateProperties<EmbedDto>(
      { author: AuthorDto, footer: FooterDto },
      dto,
      EmbedDto,
    );
    if (!this.isDefaultEmbed(cleanedDto)) {
      if (guild.type < GuildType.Premium)
        throw new ForbiddenException(`Missing access`);
    }
    return await this.embedModel.findByIdAndUpdate(
      id,
      { ...cleanedDto, guildId: guildId },
      { new: true },
    );
  }

  async delete(guildId: string, id: Types.ObjectId) {
    const guild = await this.findByIdAndGuildId(guildId, id);
    if (!guild) throw new BadRequestException(`This embed does not exists`);
    return await guild.deleteOne();
  }

  private isDefaultEmbed(embed: any): boolean {
    return defaultEmbeds.some(
      (defaultEmbed) =>
        defaultEmbed.title === embed.title &&
        defaultEmbed.description === embed.description &&
        defaultEmbed.color === embed.color &&
        !embed.image &&
        !embed.author &&
        !embed.footer &&
        !embed.thumbnail,
    );
  }
}
