import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GuildType, LanguagesEnum } from 'src/api/common/types';

@Schema({})
export class Guild extends Document {
  @Prop({ required: true, type: String, unique: true, index: true })
  guildId: string;

  @Prop({ default: GuildType.Everyone, required: true, type: Number })
  /**
   * Премиум
   * Средний премиум
   * Спонсорский премиум
   * Тестерская гильдия (выбираются разработчиками)
   * Девелоперская гильдия
   */
  type: number;

  @Prop({ default: new Date(), required: true, type: Date })
  /**
   * Когда сервер был добавлен в БД
   */
  createdAt: Date;

  @Prop({ default: [], required: true, type: Types.Array<String> })
  trustedRoles: string[];

  @Prop({ default: [], required: true, type: Types.Array<String> })
  /**
   * Система значков
   */
  badges: string[];

  @Prop({ default: LanguagesEnum.English, required: true, type: String })
  commandLanguage: LanguagesEnum;

  @Prop({ default: LanguagesEnum.English, required: true, type: String })
  interfaceLanguage: LanguagesEnum;
  
}

export const GuildSchema = SchemaFactory.createForClass(Guild);
