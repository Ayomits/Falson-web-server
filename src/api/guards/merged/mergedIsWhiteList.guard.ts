import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { IsBotGuard } from '../isBot.guard';
import { IsWhiteListGuard } from '..';
import { JwtService } from '@nestjs/jwt';
import { GuildSettingsService } from 'src/api/modules/guild-settings/guild-settings.service';

export class MergedIsWhiteList implements CanActivate {
  constructor(
    @Inject(GuildSettingsService) private guildService: GuildSettingsService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isWhite = new IsWhiteListGuard(this.guildService, this.jwtService);
    const isBot = new IsBotGuard();
    const isOwnerPromises = await Promise.all([
      isWhite.canActivate(context),
      isBot.canActivate(context),
    ]);
    return isOwnerPromises.includes(true);
  }
}
