import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { IsBotGuard } from '../isBot.guard';
import { IsWhiteListGuard } from '../IsWhiteList.guard';
import { GuildSettingsService } from 'src/api/modules/guilds-settings/guilds.service';

export class MergedIsWhiteList implements CanActivate {

  constructor(@Inject(GuildSettingsService) private guildService: GuildSettingsService) {}

  async canActivate(context: ExecutionContext) {
    const isWhite = new IsWhiteListGuard(this.guildService);
    const isBot = new IsBotGuard();
    const flags = await Promise.all([isWhite.canActivate(context), isBot]);
    return flags.includes(true);
  }
}
