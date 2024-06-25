import { InjectModel } from '@nestjs/mongoose';
import { GeneralVerificationDto } from '../dto/general.dto';
import { GeneralVerification, Verification } from '../schemas';
import { ClientFetcher, SchemasName } from 'src/api/common';
import { Model, Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { client } from 'src/discordjs';

@Injectable()
export class GeneralService {
  private clientFetcher: ClientFetcher = new ClientFetcher(client);

  constructor(
    @InjectModel(SchemasName.GeneralVerification)
    private generalVerification: Model<GeneralVerification>,
  ) {}

  async findByGuildId(guildId: string) {
    return await this.generalVerification.findOne({ guildId });
  }

  async findById(id: Types.ObjectId) {
    return await this.generalVerification.findById(id);
  }

  async create(dto: GeneralVerificationDto) {
    const existedSettings = await this.findByGuildId(dto.guildId);
    if (existedSettings)
      throw new BadRequestException(`This settings already exists`);
    return await this.generalVerification.create(dto);
  }

  async update(guildId: string, dto: GeneralVerificationDto) {
    const existedSettings = await this.findByGuildId(guildId);
    const res = {};
    Object.keys(dto).forEach((key) => {
      if (dto[key] !== undefined) {
        res[key] = dto[key]
          .map((role) => this.clientFetcher.getRoleFromCache(guildId, role))
          .filter((role) => role !== null || role !== undefined);
      }
    });
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    return await this.generalVerification.findByIdAndUpdate(
      existedSettings._id,
      { ...(res as any), guildId: guildId },
      { new: true },
    );
  }

  async delete(guildId: string) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    return await this.generalVerification.findByIdAndDelete(
      existedSettings._id,
    );
  }
}
