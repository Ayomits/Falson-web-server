import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GuildType, SchemasName } from 'src/api/common';
import { TradionVerification } from '../schemas';
import { TradionVerificationDto } from '../dto/tradition.dto';
import { GuildSettingsService } from '../../guild-settings/guild-settings.service';

@Injectable()
export class TraditionVerificationService {
  constructor(
    @InjectModel(SchemasName.TradionVerification)
    private traditionVerificationModel: Model<TradionVerification>,
    private guildService: GuildSettingsService,
  ) {}

  async findByGuildId(guildId: string) {
    const existedSettings = await this.traditionVerificationModel.findOne({
      guildId,
    });
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    return existedSettings;
  }

  async findById(id: Types.ObjectId) {
    return await this.traditionVerificationModel.findById(id)
  }

  async create(dto: TradionVerificationDto) {
    const existedSettings = await this.traditionVerificationModel.findOne({
      guildId: dto.guildId,
    });
    const guild = await this.guildService.findByGuildId(dto.guildId);
    if (guild?.type < GuildType.Premium && dto.isDouble) {
      throw new BadRequestException(
        `isDouble parametr must be false, because this guild has not premium`,
      );
    }
    if (existedSettings)
      throw new BadRequestException(`This settings already exists`);
    return await this.traditionVerificationModel.create(dto);
  }

  async update(guildId: string, dto: TradionVerificationDto) {
    const existedSettings = await this.traditionVerificationModel.findOne({
      guildId: dto.guildId,
    });
    const guild = await this.guildService.findByGuildId(dto.guildId);
    if (guild?.type < GuildType.Premium && dto.isDouble) {
      throw new BadRequestException(
        `isDouble parametr must be false, because this guild has not premium`,
      );
    }
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    return await this.traditionVerificationModel.updateOne(
      { guildId },
      { ...dto, guildId: guildId },
    );
  }

  async delete(guildId: string) {
    return await this.traditionVerificationModel.deleteOne({ guildId });
  }
}
