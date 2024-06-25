import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemasName, VerificationType } from 'src/api/common';

@Schema()
export class Verification extends Document {
  @Prop({ ref: SchemasName.Guilds, type: String, required: true })
  guildId: String;

  @Prop({
    ref: SchemasName.TradionVerification,
    type: Types.ObjectId,
    required: true,
  })
  tradionVerification: Types.ObjectId;

  @Prop({
    ref: SchemasName.VoiceVerification,
    type: Types.ObjectId,
    required: true,
  })
  voiceVerification: Types.ObjectId;

  @Prop({
    ref: SchemasName.GeneralVerification,
    required: true,
    type: Types.ObjectId,
  })
  generalVerification: Types.ObjectId;

  @Prop({ default: VerificationType.Traditional, required: true, type: Number })
  type: number;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
