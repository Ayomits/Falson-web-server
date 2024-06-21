import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GuildsController } from './guilds/guilds.controller';
import { UsersController } from 'src/api/modules/users/users.controller';
import { ExistedInDiscordMiddleware } from 'src/api/common/middlewares/existedInDiscord.middleware';
import { AuthModule } from 'src/api/modules/auth/auth.module';

@Module({
  imports: [
    AuthModule  
  ],
  controllers: [GuildsController, UsersController],
  providers: [],
})
export class DiscordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExistedInDiscordMiddleware)
      .forRoutes(GuildsController, UsersController);
  }
}
