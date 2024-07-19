import {
  forwardRef,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { GuildSettingsController } from './GuildSettingsController';

import { AuthModule, UsersModule } from 'src/api/modules';
import { MongooseModule } from '@nestjs/mongoose';
import { Guild, GuildSchema } from './schemas/GuildSchema';
import { SchemasName } from 'src/api/types';
import { GuildSettingsService } from './GuildSettingsService';
import { ExistedInDiscordMiddleware } from 'src/api/middlewares';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: SchemasName.Guilds, schema: GuildSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [GuildSettingsService ],
  controllers: [GuildSettingsController],
  exports: [GuildSettingsModule, GuildSettingsService, MongooseModule]
})
export class GuildSettingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExistedInDiscordMiddleware)
      .forRoutes(GuildSettingsController);
  }
}
