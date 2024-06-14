import { Injectable } from '@nestjs/common';
import { Users } from '../users/users.schema';
import bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { AuthToken } from './auth.schema';
import { Model } from 'mongoose';
import { DateWorking } from 'src/discordjs/common/functions/date';

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectModel(AuthToken.name) private authTokenModel: Model<AuthToken>,
  ) {}

  async generateToken(user: Users) {
    const token = await bcrypt.hash(JSON.stringify(user), 10);
    const tokenFromDb = await this.authTokenModel.findOne({
      userId: user.userId,
    });
    if (tokenFromDb) {
      await this.authTokenModel.updateOne({
        token: token,
        expireIn: new DateWorking(new Date()).addDays(5).date,
      });
    } else {
      await this.authTokenModel.create({
        userId: user.userId,
        token: token,
        expireIn: new DateWorking(new Date()).addDays(5).date,
      });
    }
  }

  async validateToken(token: string) {}
}
