import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Users {
  @Prop({ required: true })
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

  @Prop({ default: new Date() })
  createdAt?: Date;

}
export const UserScema = SchemaFactory.createForClass<Users>(Users);
