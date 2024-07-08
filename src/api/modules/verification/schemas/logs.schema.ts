import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Logs extends Document {
  @Prop({ type: String, default: null, required: true })
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
}

export const LogSchema = SchemaFactory.createForClass(Logs);
