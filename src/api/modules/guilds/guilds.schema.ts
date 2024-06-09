import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class GuildsSchema{
  @Prop()
  guildId: string

  @Prop()
  premiumStatus: number

  @Prop()
  logsChannel: {
    verifications: string
    staffAdders: string
  }

}