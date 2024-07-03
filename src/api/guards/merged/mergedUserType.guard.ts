import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IsAuthGuard } from '../isAuth.guard';
import { UserTypeGuard } from '../UserType.guard';
import { Reflector } from '@nestjs/core';
import { IsBotGuard } from '../isBot.guard';

export class MergedUserTypeGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const isAuth = new IsAuthGuard(this.jwtService).canActivate(context);
      const isBot = new IsBotGuard().canActivate(context);
      const userType = new UserTypeGuard(this.reflector).canActivate(context);
      return !!(isAuth && userType) || !!isBot;
    } catch {}
  }
}
