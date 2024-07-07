import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import {
  AuthModule,
  DiscordModule,
  GuildSettingsModule,
  StatsModule,
  UsersModule,
  VerificationModule,
} from './modules';
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
    StatsModule,
    DiscordModule,
    VerificationModule,
    GuildSettingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
