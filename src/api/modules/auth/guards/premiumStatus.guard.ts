import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GuildSettingsService } from '../../guild-settings/guild-settings.service';

export const PremiumStatus = (status: number) =>
  SetMetadata('premiumStatus', status);

@Injectable()
export class PremiumStatusGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly guildService: GuildSettingsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPremiumStatus = this.reflector.get<number>(
      'premiumStatus',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    try {
      const guildId = request.params.guildId || request.body.guildId;
      const guild = await this.guildService.findByGuildId(guildId);
      if (guild.type >= requiredPremiumStatus) return true;
      return false;
    } catch {
      return false;
    }
  }
}
