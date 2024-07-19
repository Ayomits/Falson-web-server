import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { JwtModule,  } from '@nestjs/jwt';
import { UsersModule } from '../users/UsersModule';
import { UsersService } from '../users/UsersService';
import { GuildSettingsModule } from '../guild-settings/GuildSettingsModule';


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
  providers: [AuthService, UsersService],
  exports: [AuthModule, JwtModule],
})
export class AuthModule {}
