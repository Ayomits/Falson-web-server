import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from 'src/api/types/User';

@Schema()
export class Users extends Document {
  @Prop({ required: true, type: String })
  userId: string;

  @Prop({
    type: { accessToken: String, refreshToken: String },
    required: false,
    default: {},
  })
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };

  @Prop({ default: new Date(), type: Date })
  createdAt?: Date;

  @Prop({ type: Number, default: UserType.everyone })
  type?: number;
}
export const UserScema = SchemaFactory.createForClass<Users>(Users);
