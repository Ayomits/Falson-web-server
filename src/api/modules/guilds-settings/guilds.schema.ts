import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BugHunterType,
  LanguagesEnum,
  RoleId,
} from 'src/api/common/types/base.types';

@Schema()
export class Guilds {
  @Prop({ required: true })
  guildId?: string;

  @Prop({ default: 0 })
  premiumStatus?: number;

  /**
   * Здесь будут хранится роли
   * Их айдишники
   */
  @Prop({ default: [] })
  canUsePanel?: string[];

  @Prop({ default: [] })
  badges?: string[];

  @Prop({ default: LanguagesEnum.English })
  interfaceLanguage?: string;

  @Prop({ default: LanguagesEnum.English })
  commandLanguage?: string;

  @Prop({ default: {}, type: Map })
  commands?: Map<string, boolean>;
}

export const GuildsSchema = SchemaFactory.createForClass<Guilds>(Guilds);
