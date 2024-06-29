import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PartnerPriority } from 'src/api/common/types/PartnerType';

@Schema()
export class UserPartner extends Document {
  
  @Prop({ default: null, type: String, required: false })
  userId: string;

  @Prop({ default: new Date(), type: Date })
  createdAt: Date;

  @Prop({ default: PartnerPriority.FirstLvl })
  priority: number;
}

export const UserPartnerSchema = SchemaFactory.createForClass(UserPartner)