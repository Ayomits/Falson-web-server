import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './UsersService';
import { Request } from 'express';

import { AbstractController } from 'src/api/abstractions/AbstractController';
import { JwtPayload } from 'src/api/types';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';
import { RouteType } from 'src/api/types/RouteType';
import { AuthorizedRequest } from 'src/api/types/AuthorizedRequest';

@Controller('users')
export class UsersController extends AbstractController {
  constructor(@Inject(UsersService) private usersService: UsersService) {
    super();
  }

  /**
   * Ради выдачи токенов дса
   */
  @Get(`@me`)
  @RouteProtectLevel(RouteType.USER_ONLY)
  /**
   * Гарда, для просмотра JWT токена пользователя
   * Сделать объединённую гарду для бота + пользователя
   */
  async findByUserId(@Req() req: AuthorizedRequest) {
    return this.usersService.findUser(req.user.userId);
  }

  @Get('@me/data')
  @RouteProtectLevel(RouteType.USER_ONLY)
  /**
   * Гарда, для просмотра JWT токена пользователя
   * Сделать объединённую гарду для бота + пользователя
   */
  async findUserDate(@Req() req: AuthorizedRequest) {
    return this.usersService.findUserData(req.user.userId);
  }

  @Get('@me/guilds')
  @RouteProtectLevel(RouteType.USER_ONLY)
  /**
   * Гарда, для просмотра JWT токена пользователя
   * Сделать объединённую гарду для бота + пользователя
   */
  async ownersGuild(@Req() req: AuthorizedRequest) {
    return this.usersService.ownersAndAdminsGuild(req);
  }
}
