import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'src/api/common/types/base.types';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs';
import { Guild } from 'discord.js';
import { GuildSettingsService } from '../modules/guild-settings/guild-settings.service';
import { JwtService } from '@nestjs/jwt';
import { IsAuthGuard } from './isAuth.guard';

export class IsWhiteListGuard implements CanActivate {
  constructor(
    @Inject(GuildSettingsService) private guildService: GuildSettingsService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    try {
      const isAuthGuard = new IsAuthGuard(this.jwtService).canActivate(context);
      if (!isAuthGuard) {
        return false;
      }
      const clientFetcher = new ClientFetcher(client);
      const user = request?.user as JwtPayload;
      const guildId = request.params.guildId || request.body.guildId;
      const guild = clientFetcher.getGuildFromCache(guildId) as Guild;
      const member = guild.members.cache.get(user?.userId);
      if (member?.permissions?.has(8n)) {
        return true;
      }
      if (guild?.ownerId === member?.id) {
        return true;
      }
      const guildFromDb = await this.guildService.findByGuildId(guildId);
      if (
        member.roles?.cache.some((role) =>
          guildFromDb.trustedRoles.includes(role.id),
        )
      ) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}
