import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Guild } from '../../guild-settings/schemas/guilds.schema';
import { Embed } from './embeds.schema';
import { SchemasName } from 'src/api/common';

@Schema({  })
export class TradionVerification extends Document {
  @Prop({ type: String, ref: SchemasName.Guilds, required: true, unique: true })
  guildId: string;
  /**
   * Канал в который по вебсокету будет высылаться верификация
   */
  @Prop({ type: String, default: null })
  channelId: string;
  /**
   * Прем фича двойной верификации
   * Сначала традиционная + капча
   */
  @Prop({ type: Boolean, default: false })
  isDouble: boolean;

}

export const TradionVerificationSchema =
  SchemaFactory.createForClass(TradionVerification);
