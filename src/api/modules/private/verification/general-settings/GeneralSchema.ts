import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemasName, VerificationType } from 'src/api/types';

@Schema()
export class GeneralVerification extends Document {
  @Prop({ required: true, ref: SchemasName.Guilds, unique: true })
  guildId: string;

  /**
   * Роли верификации
   * Максимум 25 штук
   */
  @Prop({ type: Types.Array<String>, default: [], required: false })
  verificationRoles: string[];

  @Prop({ type: String, required: false })
  unverifyRole: string;

  @Prop({ type: Number, required: true, default: VerificationType.Traditional })
  type: number;
}

export const GeneralVerificationSchema =
  SchemaFactory.createForClass(GeneralVerification);
