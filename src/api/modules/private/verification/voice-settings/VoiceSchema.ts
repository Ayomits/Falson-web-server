import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemasName } from 'src/api/types';

@Schema()
export class VoiceVerification extends Document {
  @Prop({ required: true, ref: SchemasName.Guilds, unique: true })
  guildId: string;

  @Prop({ default: [], type: Types.Array<String>, maxlength: 2 })
  verificationCategories: string[];

  @Prop({ default: [], type: Types.Array<String>, maxlength: 5 })
  verificationIgnoredChannels: string[];

  @Prop({ default: [], type: Types.Array<String> })
  verificationStaffCurators: string[];

  @Prop({ default: [], type: Types.Array<String> })
  verificationStaffFullAccess: string[];

  @Prop({ default: null, type: Types.Array<String> })
  verificationStaffSupport: string;
}

export const VoiceSchema =
  SchemaFactory.createForClass(VoiceVerification);
