import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleId } from 'src/api/common/types/base.types';

@Schema()
export class Guilds {
  @Prop({ required: true })
  guildId: string;

  @Prop({ default: 0 })
  premiumStatus?: number;

  /**
   * Здесь будут хранится роли/пользователи
   * Их айдишники
   */
  @Prop({ default: [] })
  canUsePanel: string[];
}

export const GuildsSchema = SchemaFactory.createForClass<Guilds>(Guilds);
