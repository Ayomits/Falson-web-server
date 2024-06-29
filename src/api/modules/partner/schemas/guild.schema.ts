import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PartnerPriority } from 'src/api/common/types/PartnerType';

@Schema()
export class GuildPartner extends Document {

  @Prop({default: null, type: String, required: true})
  guildId: string

  @Prop({ default: null, type: String, required: true })
  invite: string;

  @Prop({ default: new Date(), type: Date })
  createdAt: Date;

  @Prop({ default: PartnerPriority.FirstLvl })
  priority: number;
}

export const GuildPartnerSchema = SchemaFactory.createForClass(GuildPartner)
