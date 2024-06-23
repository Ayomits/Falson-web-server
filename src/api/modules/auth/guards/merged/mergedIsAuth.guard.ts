import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { IsBotGuard } from '../isBot.guard';
import { IsAuthGuard } from '../isAuth.guard';
import { JwtService } from '@nestjs/jwt';

export class MergedIsAuth implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const isOwner = new IsAuthGuard(this.jwtService);
    const isBot = new IsBotGuard();
    const flags = await Promise.all([isOwner.canActivate(context), isBot]);
    return flags.includes(true);
  }
}
