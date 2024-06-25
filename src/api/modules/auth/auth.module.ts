import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { GuildSettingsModule } from '../guild-settings/guild-settings.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      signOptions: {
        expiresIn: `10s`,
      },
    }),
    forwardRef(() => GuildSettingsModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
  ],
  exports: [
    AuthModule,
    JwtModule,
  ],
})
export class AuthModule {}
