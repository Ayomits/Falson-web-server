import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleId } from 'src/api/common/types/base.types';

@Schema()
export class Guilds {
  @Prop({ required: true })
  guildId: string;

  @Prop({ default: 0 })
  premiumStatus?: number;

  @Prop({
    type: {
      verifications: String,
      staffAdders: String,
    },
    required: false,
    default: null,
  })
  logsChannel?: {
    verifications: string;
    staffAdders: string;
  };

  @Prop({ type: Map, default: new Map<string, RoleId>() })
  verificationsRoles: Map<string, RoleId>;

  @Prop({ default: [] })
  canUsePanel: string[];
}

export const GuildsSchema = SchemaFactory.createForClass<Guilds>(Guilds);
