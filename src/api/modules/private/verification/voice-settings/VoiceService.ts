import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { VoiceVerificationDto } from './VoiceDto';
import { Cache } from '@nestjs/cache-manager';
import { SchemasName } from 'src/api/types';
import { VoiceVerification } from './VoiceSchema';

@Injectable()
export class VoiceVerificationService {
  constructor(
    @InjectModel(SchemasName.VoiceVerification)
    private voiceVerification: Model<VoiceVerification>,
    private cacheManager: Cache,
  ) {}

  async findByGuildId(guildId: string) {
    const cacheKey = `voice_${guildId}`;
    const cacheVerification =
      await this.cacheManager.get<VoiceVerification>(cacheKey);
    if (cacheVerification) return cacheVerification;
    const fetched = await this.fetchByGuildId(guildId);
    if (fetched) {
      await this.cacheManager.set(fetched._id.toString(), fetched);
      await this.cacheManager.set(cacheKey, fetched);
      return fetched;
    }
    return fetched;
  }

  async fetchByGuildId(guildId: string) {
    return await this.voiceVerification.findOne({ guildId });
  }

  async findById(id: Types.ObjectId) {
    return (
      (await this.cacheManager.get(id.toString())) ||
      (await this.voiceVerification.findById(id))
    );
  }

  async create(dto: VoiceVerificationDto) {
    const existedSettings = await this.findByGuildId(dto.guildId);
    if (existedSettings)
      throw new BadRequestException(`This settings already exists`);
    const newVerification = await this.voiceVerification.create(dto);
    await this.cacheManager.set(`voice_${dto.guildId}`, newVerification);
    await this.cacheManager.set(
      newVerification._id.toString(),
      newVerification,
    );
    return newVerification;
  }

  async update(guildId: string, dto: VoiceVerificationDto) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    const newVerification = await this.voiceVerification.findByIdAndUpdate(
      existedSettings._id,
      { ...dto, guildId: guildId },
      { new: true, upsert: true },
    );
    await this.cacheManager.set(`voice_${guildId}`, newVerification);
    await this.cacheManager.set(
      existedSettings._id.toString(),
      newVerification,
    );
    return newVerification;
  }

  async createOrUpdate(guildId: string) {
    const existed = await this.findByGuildId(guildId);
    if (existed) return this.update(guildId, { guildId: guildId });
    return this.create({ guildId: guildId });
  }

  async delete(guildId: string) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    await this.voiceVerification.findByIdAndDelete(existedSettings._id);
    await this.cacheManager.del(`voice_${guildId}`);
    await this.cacheManager.del(existedSettings._id.toString());
    return { message: `successfully delete` };
  }
}
