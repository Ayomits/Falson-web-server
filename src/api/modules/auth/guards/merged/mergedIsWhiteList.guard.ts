import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { IsBotGuard } from '../isBot.guard';
import { IsWhiteListGuard } from '../IsWhiteList.guard';
import { GuildSettingsService } from 'src/api/modules/guilds-settings/guilds.service';
import { JwtService } from '@nestjs/jwt';
import { IsAuthGuard } from '../isAuth.guard';

export class MergedIsWhiteList implements CanActivate {
  constructor(
    @Inject(GuildSettingsService) private guildService: GuildSettingsService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isAuth = new IsAuthGuard(this.jwtService);
    const isWhite = new IsWhiteListGuard(this.guildService);
    const isBot = new IsBotGuard();
    const isOwnerPromises = await Promise.all([
      isAuth.canActivate(context),
      isWhite.canActivate(context),
    ]);
    const flags = await Promise.all([isBot.canActivate(context)]);
    if (isOwnerPromises.includes(false) || flags.includes(false)) return false;
    return true;
  }
}
