import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PremiumStatus = (status: number) =>
  SetMetadata('premiumStatus', status);

@Injectable()
export class PremiumStatusGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPremiumStatus = this.reflector.get<number>(
      'premiumStatus',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    
    if (!request.guild) {
      throw new ForbiddenException('Guild not found in request.');
    }

    const guildPremiumStatus = request.guild.premiumStatus

    if (guildPremiumStatus >= requiredPremiumStatus) {
      return true;
    }
    
    throw new ForbiddenException(
      `Missing access. Required premium lvl: ${requiredPremiumStatus}`,
    );
  }
}
