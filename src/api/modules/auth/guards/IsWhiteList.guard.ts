import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { JwtPayload } from 'src/api/common/types/base.types';
import { GuildsService } from '../../guilds/guilds.service';
import { Guilds } from '../../guilds/guilds.schema';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs';
import { Guild } from 'discord.js';

export class IsWhiteListGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private userService: UsersService,
    @Inject(GuildsService) private guildService: GuildsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    try {
      const clientFetcher = new ClientFetcher(client);
      const user = request.user as JwtPayload;
      const guildId = request.params.guildId || request.body.guildId;
      const guild = clientFetcher.getGuildFromCache(guildId) as Guild;
      const member = await guild.members.fetch(user.userId);
      const guildFromDb = (await this.guildService.findByGuildId(
        guildId,
      )) as Guilds;
      if (member?.permissions?.has(8n)) {
        return true;
      }
      if (guild?.ownerId === member?.id) {
        return true;
      }
      if (
        member.roles?.cache.some((role) =>
          guildFromDb.canUsePanel.includes(role.id),
        )
      ) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      throw new ForbiddenException(`Missing access`);
    }
  }
}
