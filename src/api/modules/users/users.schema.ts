import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Users {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: 0 })
  balance?: number;

  @Prop({ required: true })
  email?: string;

  @Prop({
    type: { accessToken: String, refreshToken: String },
    required: false,
    default: {},
  })
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}
export const UserScema = SchemaFactory.createForClass<Users>(Users);
