import { InjectModel } from '@nestjs/mongoose';
import { GeneralVerificationDto } from '../dto/general.dto';
import { GeneralVerification, Verification } from '../schemas';
import { ClientFetcher, SchemasName } from 'src/api/common';
import { Model, Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { client } from 'src/discordjs/main';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class GeneralService {
  private clientFetcher: ClientFetcher = new ClientFetcher(client);

  constructor(
    @InjectModel(SchemasName.GeneralVerification)
    private generalVerification: Model<GeneralVerification>,
    private cacheManager: Cache,
  ) {}

  async findByGuildId(guildId: string) {
    const cacheKey = `general_${guildId}`;
    const cacheVerification =
      await this.cacheManager.get<GeneralVerification>(cacheKey);
    if (cacheVerification) return cacheVerification;
    const fetched = await this.fetchByGuildId(guildId);
    if (fetched) {
      await this.cacheManager.set(cacheKey, fetched);
      await this.cacheManager.set(fetched._id.toString(), fetched);
      return fetched;
    }
    return fetched;
  }

  async fetchByGuildId(guildId: string) {
    return await this.generalVerification.findOne({ guildId });
  }

  async findById(id: Types.ObjectId) {
    const cacheKey = id.toString();
    const cacheVerification =
      await this.cacheManager.get<GeneralVerification>(cacheKey);
    if (cacheVerification) return cacheVerification;
    return await this.generalVerification.findById(id);
  }

  async create(dto: GeneralVerificationDto) {
    const existedSettings = await this.findByGuildId(dto.guildId);
    if (existedSettings)
      throw new BadRequestException(`This settings already exists`);
    const newVerification = await this.generalVerification.create(dto);
    await this.cacheManager.set(newVerification._id.toString(), newVerification);
    await this.cacheManager.set(`general_${dto.guildId}`, newVerification);
    return newVerification;
  }

  async update(guildId: string, dto: GeneralVerificationDto) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    const res = {};

    Object.keys(dto).forEach((key) => {
      if (dto[key] !== undefined) {
        res[key] = dto[key]
          .map((role) => this.clientFetcher.getRoleFromCache(guildId, role))
          .filter((role) => role !== null || role !== undefined);
      }
    });
    const newVerification = await this.generalVerification.findByIdAndUpdate(
      existedSettings._id,
      { ...(res as any), guildId: guildId },
      { new: true },
    );
    await this.cacheManager.set(newVerification._id.toString(), newVerification);
    await this.cacheManager.set(`general_${guildId}`, newVerification);
    return newVerification;
  }

  async delete(guildId: string) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    await this.cacheManager.del(`general_${guildId}`);
    await this.cacheManager.del(existedSettings._id.toString());
    this.generalVerification.findByIdAndDelete(existedSettings._id);
    return { message: `succesfully deleted` };
  }
}
