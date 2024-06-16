import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';
import { IsAuthGuard } from './isAuth.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/api/common/types/base.types';

export class IsServerOwnerGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private userService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isAuth = new IsAuthGuard(this.jwtService).canActivate(context);
    if (!isAuth) {
      throw new UnauthorizedException(`Unathorized 401`);
    }
    const req = context.switchToHttp().getRequest() as Request;
    const guildId = req.body.guildId || req.params.guildId
    const guilds = await this.userService.findUserGuilds(
      (req.user as JwtPayload).userId as string,
    );
    const currentGuild = guilds.find(guild => guild.id === guildId)
    return !!currentGuild    
  }
}
