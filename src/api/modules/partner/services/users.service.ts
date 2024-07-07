import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SchemasName } from 'src/api/common';
import { UserPartner } from '../schemas/user.schema';
import { Cache } from '@nestjs/cache-manager';
import { UserPartnerDto } from '../dto/users.dto';
import { BadRequestException } from '@nestjs/common';

export class UserPartnersService {
  constructor(
    @InjectModel(SchemasName.UserPartner)
    private userPartnerModel: Model<UserPartner>,
    private cacheManager: Cache,
  ) {}

  async findAll() {
    return await this.userPartnerModel.find();
  }

  async findByUserId(userId: string) {
    const userFromCache = await this.cacheManager.get<UserPartner>(
      `${userId}-partner`,
    );
    if (userFromCache) return userFromCache;
    const fetched = await this.fetchByUserId(userId);
    if (fetched) {
      await this.cacheManager.set(`${userId}-partner`, fetched);
    }
    return fetched;
  }

  async fetchByUserId(userId: string) {
    return await this.userPartnerModel.findOne({ userId });
  }

  async create(dto: UserPartnerDto) {
    const existed = await this.findByUserId(dto.userId);
    if (existed) throw new BadRequestException(`This partner already exists`);
    const newpartner = await this.userPartnerModel.create(dto);
    await this.cacheManager.set(`${dto.userId}-partner`, newpartner);
    return newpartner;
  }

  async update(userId: string, dto: UserPartnerDto) {
    const existed = await this.findByUserId(userId);
    if (!existed) throw new BadRequestException(`This partner does not exist`);
    const updated = await this.userPartnerModel.findOneAndUpdate(existed._id, {
      ...dto,
      userId: userId,
    });
    await this.cacheManager.set(`${userId}-partner`, updated);
    return updated;
  }

  async delete(userId: string) {
    const existed = await this.findByUserId(userId);
    if (!existed) throw new BadRequestException(`This partner does not exist`);
    await this.cacheManager.del(`${userId}-partner`);
    await this.userPartnerModel.findByIdAndDelete(existed._id);
    return { message: `user partner successfully deleted` };
  }
}
