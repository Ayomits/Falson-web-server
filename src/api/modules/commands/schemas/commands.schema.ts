import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemasName } from 'src/api/common';

@Schema()
export class GuildCommand extends Document {
  @Prop({ ref: SchemasName.Guilds, type: String, required: true })
  guildId: string;

  @Prop({ type: String, required: true })
  commandName: string;

  @Prop({ default: true, type: Boolean })
  isEnabled: boolean;

  @Prop({ default: [], type: Types.Array<String> })
  roles: string[];

  @Prop({ default: [], type: Types.Array<String> })
  channels: string[];
}

export const GuildCommandSchema = SchemaFactory.createForClass(GuildCommand);
