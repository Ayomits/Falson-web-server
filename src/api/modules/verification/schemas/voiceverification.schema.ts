import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemasName } from 'src/api/common';

@Schema()
export class VoiceVerification extends Document {

  @Prop({ required: true, ref: SchemasName.Guilds, unique: true })
  guildId: string;

  @Prop({ default: [], type: Types.Array<String> })
  verificationCategories: string[];

  @Prop({ default: [], type: Types.Array<String> })
  verificationIgnoredChannels: string[];

  @Prop({ default: [], type: Types.Array<String> })
  verificationStaffCurators: string[];

  @Prop({ default: [], type: Types.Array<String> })
  verificationStaffSupports: string[];
}

export const VoiceVerificationSchema =
  SchemaFactory.createForClass(VoiceVerification);
