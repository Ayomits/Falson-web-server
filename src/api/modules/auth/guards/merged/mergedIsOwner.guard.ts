import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { IsServerOwnerGuard } from '../isServerOwner.guard';
import { IsBotGuard } from '../isBot.guard';
import { IsAuthGuard } from '../isAuth.guard';
import { JwtService } from '@nestjs/jwt';

export class MergedIsOwner implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const isAuth = new IsAuthGuard(this.jwtService);
    const isOwner = new IsServerOwnerGuard();
    const isBot = new IsBotGuard();
    const isOwnerPromises = await Promise.all([
      isAuth.canActivate(context),
      isOwner.canActivate(context),
    ]);
    const flags = await Promise.all([isBot.canActivate(context)]);
    if (isOwnerPromises.includes(false) || flags.includes(false)) return false;
    return true;
  }
}
