import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { GuildsModule } from './modules/guilds/guilds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Сделать модуль глобальным
    }),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Импортировать ConfigModule здесь
      inject: [ConfigService], // Инжектировать ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGOOSE_URI'),
      }),
    }),
    UsersModule,
    GuildsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}