import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemasName } from 'src/api/common';

@Schema()
export class GeneralVerification extends Document {
  @Prop({ required: true, ref: SchemasName.Guilds, unique: true })
  guildId: string;
  /**
   * Логи отзывов для голосовой верификации
   */
  @Prop({ type: String, default: null, required: false })
  feedbacksLog: string;

  /**
   * Логи принятий в стафф для голосовой верификации
   */
  @Prop({ type: String, default: null, required: false })
  acceptionLog: string;

  /**
   * Логи для верефицированных
   */
  @Prop({ type: String, default: null, required: false })
  verificationLog: string;

  /**
   * Роли верификации
   * Максимум 25 штук
   */
  @Prop({ type: Types.Array<String>, default: [], required: false })
  verificationRoles: string[];

  @Prop({ type: String, required: false })
  unverifyRole: string;
}

export const GeneralVerificationSchema =
  SchemaFactory.createForClass(GeneralVerification);
