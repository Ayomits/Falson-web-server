import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AbstractGuard } from '../abstractions/AbstractGuard';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RouteType } from '../types/RouteType';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types';
import { AuthorizedRequest } from '../types/AuthorizedRequest';
import { GuildSettingsService } from '../modules/private/guild-settings/GuildSettingsService';

@Injectable()
export class EndpointsGuard extends AbstractGuard implements CanActivate {
  constructor(
    private guildService: GuildSettingsService,
    private reflector: Reflector,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;
    try {
      const headers = req.headers;
      const handler = context.getHandler();
      const requestType = this.reflector.get<RouteType>(`RequestType`, handler);
      if (!requestType) {
        return true;
      }
      if (requestType === RouteType.PUBLIC) {
        return true;
      }
      if (requestType === RouteType.USER_ONLY) {
        return this.verifyUser(headers, req).status;
      }
      if (requestType === RouteType.BOT_ONLY) {
        return this.verifyBot(headers).status;
      }
      if (requestType === RouteType.BOT_USER) {
        const userVerify = this.verifyUser(headers, req);
        const botVerify = this.verifyBot(headers);
        if (userVerify.status || botVerify.status) {
          return true;
        }
        return false;
      }
      if (requestType === RouteType.SERBER_WHITE_LIST) {
        return (await this.verifyWhiteList(headers, req as AuthorizedRequest))
          .status;
      }
      if (requestType === RouteType.SERVER_OWNER) {
        return this.verifyGuildOwner(headers, req as AuthorizedRequest).status;
      }
      if (requestType === RouteType.OWNER_BOT) {
        return (
          this.verifyGuildOwner(headers, req as AuthorizedRequest).status ||
          this.verifyBot(headers).status
        );
      }
      if (requestType === RouteType.WHITE_LIST_BOT) {
        return (
          (await this.verifyWhiteList(headers, req as AuthorizedRequest))
            .status || this.verifyBot(headers).status
        );
      }
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  private verifyBot(headers: any) {
    const botToken = headers['x-bot-token'];
    let status = false;
    if (botToken === this.configService.get<string>('TOKEN')) {
      return { status };
    }
    return { status: !status };
  }
  private verifyUser(headers: any, req: Request) {
    const token = headers['authorization'].split(' ');
    if (token[0] !== 'Bearer') return { status: false };
    const payload = this.jwtService.verify(token[1], {
      secret: this.configService.get('ACCESS_SECRET_KEY'),
    });
    if (payload) {
      req.user = payload as JwtPayload;
      return { status: true };
    }
    return { status: false };
  }
  private verifyGuildOwner(headers: any, req: AuthorizedRequest) {
    const verifyUser = this.verifyUser(headers, req);
    if (verifyUser.status) {
      const guildId = req.params.guildId || req.body.guildId;
      const guild = this.clientFetcher.getGuildFromCache(guildId);
      if (!guild) {
        return { status: false };
      }
      return { status: req.user.userId === guild.ownerId };
    }
    return { status: false };
  }
  private async verifyWhiteList(headers: any, req: AuthorizedRequest) {
    const verifyUser = this.verifyUser(headers, req);
    if (verifyUser.status) {
      const guildId = req.params.guildId || req.body.guildId;
      const verifyOwner = this.verifyGuildOwner(headers, req);
      if (verifyOwner.status) {
        return { status: true };
      }
      const guildFromDb = await this.guildService.findByGuildId(guildId);
      const guildMember = this.clientFetcher.getMemberFromCache(
        guildId,
        req.user.userId,
      );
      if (!guildMember) {
        return { status: false };
      }
      return {
        status: guildMember.roles.cache.some((role) =>
          guildFromDb.trustedRoles.includes(role.id),
        ),
      };
    }
    return { status: false };
  }
}
