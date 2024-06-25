import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommandsController } from './commands.controller';
import { CommandsService } from './commands.service';
import { ExistedInDiscordMiddleware } from 'src/api/middlewares';
import { MongooseModule } from '@nestjs/mongoose';
import { GuildCommand, GuildCommandSchema } from './schemas/commands.schema';
import { SchemasName } from 'src/api/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SchemasName.GuildCommands, schema: GuildCommandSchema },
    ]),
  ],
  controllers: [CommandsController],
  providers: [CommandsService],
})
export class CommandsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExistedInDiscordMiddleware).forRoutes(CommandsController);
  }
}
