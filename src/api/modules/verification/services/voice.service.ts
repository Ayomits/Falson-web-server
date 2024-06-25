import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SchemasName } from 'src/api/common';
import { VoiceVerification } from '../schemas';
import { VoiceVerificationDto } from '../dto/voice.dto';

@Injectable()
export class VoiceVerificationService {
  constructor(
    @InjectModel(SchemasName.VoiceVerification)
    private voiceVerification: Model<VoiceVerification>,
  ) {}

  async findByGuildId(guildId: string) {
    return await this.voiceVerification.findOne({ guildId });
  }

  async findById(id: Types.ObjectId) {
    return await this.voiceVerification.findById(id);
  }

  async create(dto: VoiceVerificationDto) {
    const existedSettings = await this.findByGuildId(dto.guildId);
    if (existedSettings)
      throw new BadRequestException(`This settings already exists`);
    return await this.voiceVerification.create(dto);
  }

  async update(guildId: string, dto: VoiceVerificationDto) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    return await this.voiceVerification.findByIdAndUpdate(
      existedSettings._id,
      { ...dto, guildId: guildId },
      { new: true },
    );
  }

  async delete(guildId: string) {
    const existedSettings = await this.findByGuildId(guildId);
    if (!existedSettings)
      throw new BadRequestException(`This settings does not exists`);
    return await this.voiceVerification.findByIdAndDelete(existedSettings._id);
  }
}
