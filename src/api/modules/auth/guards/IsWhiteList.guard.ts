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

export class IsWhiteListGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private userService: UsersService,
    @Inject(GuildsService) private guildServuce: GuildsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    try {
      const clientFetcher = new ClientFetcher(client)
      const user = request.user as JwtPayload;
      const guilds = (await this.userService.findUserGuilds(user.userId)).map(
        (guild) => guild.id,
      );
      const guildId = request.params.guildId || request.body.guildId;
      const guild = (request as any).guild as Guilds
      if (guilds.includes(guildId)) {
        return true
      }
      return false;
    } catch {
      throw new ForbiddenException(`Missing access`);
    }
  }
}
