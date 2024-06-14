import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class AuthToken{
  @Prop()
  userId: string

  @Prop()
  token: string

  @Prop()
  expireIn: Date
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken)
