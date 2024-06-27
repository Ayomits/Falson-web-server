import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { IsServerOwnerGuard } from '../isServerOwner.guard';
import { IsBotGuard } from '../isBot.guard';
import { IsAuthGuard } from '../isAuth.guard';
import { JwtService } from '@nestjs/jwt';

export class MergedIsOwner implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const isOwner = new IsServerOwnerGuard(this.jwtService);
    const isBot = new IsBotGuard();
    const isOwnerPromises = await Promise.all([
      isBot.canActivate(context),
      isOwner.canActivate(context),
    ]);
    return isOwnerPromises.includes(true);
  }
}
