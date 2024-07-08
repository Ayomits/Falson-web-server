import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemasName, VerificationType } from 'src/api/common';

@Schema()
export class Verification extends Document {
  @Prop({ ref: SchemasName.Guilds, type: String, required: true, unique: true })
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

  @Prop({ ref: SchemasName.VerificationLogs })
  logs: Types.ObjectId
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
