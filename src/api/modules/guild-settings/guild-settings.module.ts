import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { GuildSettingsController } from './guild-settings.controller';
import { GuildSettingsService } from './guild-settings.service';
import { AuthModule, UsersModule } from 'src/api/modules';
import { MongooseModule } from '@nestjs/mongoose';
import { Guild, GuildSchema } from './schemas/guilds.schema';
import { ExistedInDiscordMiddleware, SchemasName } from 'src/api/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SchemasName.Guilds, schema: GuildSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [GuildSettingsService],
  controllers: [GuildSettingsController],
  exports: [GuildSettingsModule, GuildSettingsService]
})
export class GuildSettingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExistedInDiscordMiddleware)
      .forRoutes(GuildSettingsController);
  }
}
