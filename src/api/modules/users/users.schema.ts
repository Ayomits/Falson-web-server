import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Users{
  @Prop()
  userId: string

  @Prop()
  username: string

  @Prop()
  balance: number

  @Prop()
  email: string
}
export const UserScema = SchemaFactory.createForClass<Users>(Users)