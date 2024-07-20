import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExistedInDiscordMiddleware } from 'src/api/middlewares/ExistedInDiscordMiddleware';
import { AuthModule } from 'src/api/modules/private/auth/AuthModule';
import { DiscordGuildController } from './DiscordGuildController';
import { DiscordUserController } from './DiscordUserController';

@Module({
  imports: [AuthModule],
  controllers: [DiscordUserController, DiscordGuildController],
  providers: [],
})
export class DiscordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExistedInDiscordMiddleware)
      .forRoutes(DiscordUserController, DiscordGuildController);
  }
}
