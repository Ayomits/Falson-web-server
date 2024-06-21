import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { IsAuthGuard } from './guards/isAuth.guard';
import { IsBotGuard } from './guards/isBot.guard';
import { IsServerOwnerGuard } from './guards/isServerOwner.guard';
import { IsWhiteListGuard } from './guards/IsWhiteList.guard';
import { GuildsSettinsModule } from '../guilds-settings/guilds.module';
import { PremiumStatusGuard } from './guards/premiumStatus.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      signOptions: {
        expiresIn: `10s`,
      },
    }),
    forwardRef(() => GuildsSettinsModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    IsAuthGuard,
    IsBotGuard,
    IsServerOwnerGuard,
    IsWhiteListGuard,
    PremiumStatusGuard,
  ],
  exports: [
    AuthModule,
    IsAuthGuard,
    IsBotGuard,
    IsServerOwnerGuard,
    GuildsSettinsModule,
    IsWhiteListGuard,
    PremiumStatusGuard,
    JwtModule,
  ],
})
export class AuthModule {}
