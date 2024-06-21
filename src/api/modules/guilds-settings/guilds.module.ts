import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { GuildsController } from './guilds.controller';
import { GuildSettingsService } from './guilds.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Guilds, GuildsSchema } from './guilds.schema';
import { AuthModule } from '../auth/auth.module';
import { ExistedGuildMiddleware } from 'src/api/common/middlewares/existedGuild.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Guilds.name, schema: GuildsSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [GuildsController],
  providers: [GuildSettingsService],
  exports: [GuildsSettinsModule, GuildSettingsService, MongooseModule],
})
export class GuildsSettinsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExistedGuildMiddleware).forRoutes(GuildsController);
  }
}
