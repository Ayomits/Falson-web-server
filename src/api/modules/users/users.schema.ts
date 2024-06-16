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

  /**
   * С этого места очень подробно.
   * Мы используем авторизацию по JWT и имеем 2 токена. Access и Refresh.
   * Access имеет время жизни 15 минут. Чтобы пользователю не перелогиниваться, access можно будет получить по refresh и refresh по access
   * Мб  может отнимать много времени, но зато удобно и безопасно!
   */
  @Prop({ required: true })
  refreshToken?: string;
}
export const UserScema = SchemaFactory.createForClass<Users>(Users);
