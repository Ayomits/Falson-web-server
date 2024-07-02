import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from 'src/api/modules/users/users.controller';
import { ExistedInDiscordMiddleware } from 'src/middlewares/existedInDiscord.middleware';
import { AuthModule } from 'src/api/modules/auth/auth.module';
import { GuildsController } from './controllers/guilds.controller';
import { DiscordUsersController } from './controllers/users.controller';

@Module({
  imports: [
    AuthModule  
  ],
  controllers: [GuildsController, DiscordUsersController],
  providers: [],
})
export class DiscordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExistedInDiscordMiddleware)
      .forRoutes(GuildsController, DiscordUsersController);
  }
}
