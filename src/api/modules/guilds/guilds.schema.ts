import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BugHunterType, LanguagesEnum, RoleId } from 'src/api/common/types/base.types';

@Schema()
export class Guilds {
  @Prop({ required: true })
  guildId?: string;

  @Prop({ default: 0 })
  premiumStatus?: number;

  /**
   * Здесь будут хранится роли/пользователи
   * Их айдишники
   */
  @Prop({ default: [] })
  canUsePanel?: string[];
  
  @Prop({default: BugHunterType.NoBugHunter})
  bugHunter?: number
}

export const GuildsSchema = SchemaFactory.createForClass<Guilds>(Guilds);
