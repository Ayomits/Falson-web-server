import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PremiumStatusGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPremiumStatus = this.reflector.get<number>(
      'premiumStatus',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    try {
      if (request.guild.premiumStatus >= requiredPremiumStatus) {
        return true;
      }
      throw new ForbiddenException(
        `Missing access. Required premium lvl: ${requiredPremiumStatus}`,
      );
    } catch {
      throw new ForbiddenException(
        `Missing access. Required premium lvl: ${requiredPremiumStatus}`,
      );
    }
  }
}

export const PremiumStatus = (status: number) =>
  SetMetadata(`premiumStatus`, status);
