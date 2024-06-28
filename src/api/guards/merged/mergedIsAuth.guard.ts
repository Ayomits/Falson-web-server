import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IsAuthGuard } from '../isAuth.guard';
import { IsBotGuard } from '../isBot.guard';

export class MergedIsAuth implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    try {
      const isAuthGuard = new IsAuthGuard(this.jwtService);
      const isBotGuard = new IsBotGuard();
      const flags = await Promise.all([
        isAuthGuard.canActivate(context),
        isBotGuard.canActivate(context),
      ]);
      return flags.includes(true);
    } catch {
      return false;
    }
  }
}
