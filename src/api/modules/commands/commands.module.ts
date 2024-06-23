import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommandsController } from './commands.controller';
import { CommandsService } from './commands.service';
import { ExistedInDiscordMiddleware } from 'src/api/common/middlewares';

@Module({
  controllers: [CommandsController],
  providers: [CommandsService]
})
export class CommandsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExistedInDiscordMiddleware).forRoutes(CommandsController)
  }
}
