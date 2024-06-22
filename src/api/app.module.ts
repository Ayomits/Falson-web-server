import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { GuildsSettinsModule } from './modules/guilds-settings/guilds.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomCacheInterceptor } from './interceptors/cache.interceptor';
import { VerificationModule } from './modules/verification/verification.module';
import { StatsModule } from './modules/stats/stats.module';
import { Guilds } from './modules/guilds-settings/guilds.schema';
import { DiscordModule } from 'src/api/modules/discord/discord.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 600_000,
    }),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGOOSE_URI'),
      }),
    }),
    UsersModule,
    GuildsSettinsModule,
    Guilds,
    VerificationModule,
    StatsModule,
    DiscordModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor,
    },
  ],
})
export class AppModule {}
