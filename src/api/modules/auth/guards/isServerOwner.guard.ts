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
import { JwtService } from '@nestjs/jwt';
import { IsAuthGuard } from './isAuth.guard';

export class IsServerOwnerGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    try {
      const isAuthGuard = new IsAuthGuard(this.jwtService).canActivate(context);
      if (!isAuthGuard) return false;
      const clientFetcher = new ClientFetcher(client);
      const guildId = request.body.guildId || request.params.guildId;
      const guild = clientFetcher.getGuildFromCache(guildId);
      return guild.ownerId === (request.user as JwtPayload).userId;
    } catch {
      return false;
    }
  }
}
