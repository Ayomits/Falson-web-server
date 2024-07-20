import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { EndpointsGuard } from './guards/EndpointsGuard';
import { PrivateModule } from './modules/private/private.module';
import { PublicModule } from './modules/public/public.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 600_000,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGOOSE_URI'),
      }),
    }),

    PrivateModule,
    PublicModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: EndpointsGuard,
    },
  ],
})
export class AppModule {}
