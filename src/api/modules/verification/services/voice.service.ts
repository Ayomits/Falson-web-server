import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SchemasName } from 'src/api/common';
import { VoiceVerification } from '../schemas';
import { VoiceVerificationDto } from '../dto/voice.dto';
import { Cache } from '@nestjs/cache-manager';

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
      this.cacheManager.set(fetched._id.toString(), fetched);
      this.cacheManager.set(cacheKey, fetched);
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
    this.cacheManager.set(`voice_${dto.guildId}`, newVerification);
    this.cacheManager.set(newVerification._id.toString(), newVerification);
    return newVerification;
  }

  async update(guildId: string, dto: VoiceVerificationDto) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    const newVerification = await this.voiceVerification.findByIdAndUpdate(
      existedSettings._id,
      { ...dto, guildId: guildId },
      { new: true },
    );
    this.cacheManager.set(`voice_${guildId}`, newVerification);
    this.cacheManager.set(existedSettings._id.toString(), newVerification);
    return newVerification;
  }

  async delete(guildId: string) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    await this.voiceVerification.findByIdAndDelete(existedSettings._id);
    this.cacheManager.del(`voice_${guildId}`);
    this.cacheManager.del(existedSettings._id.toString());
    return { message: `successfully delete` };
  }
}
