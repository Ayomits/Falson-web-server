import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './UsersService';
import { Request } from 'express';

import { AbstractController } from 'src/api/abstractions/AbstractController';
import { JwtPayload } from 'src/api/types';

@Controller('users')
export class UsersController extends AbstractController {
  constructor(@Inject(UsersService) private usersService: UsersService) {
    super();
  }

  /**
   * Ради выдачи токенов дса
   */
  @Get(`@me`)
  /**
   * Гарда, для просмотра JWT токена пользователя
   * Сделать объединённую гарду для бота + пользователя
   */
  async findByUserId(@Req() req: Request) {
    return this.usersService.findUser((req.user as JwtPayload).userId);
  }

  @Get('@me/data')
  /**
   * Гарда, для просмотра JWT токена пользователя
   * Сделать объединённую гарду для бота + пользователя
   */
  async findUserDate(@Req() req: Request) {
    return this.usersService.findUserData((req.user as JwtPayload).userId);
  }

  @Get('@me/guilds')
  /**
   * Гарда, для просмотра JWT токена пользователя
   * Сделать объединённую гарду для бота + пользователя
   */
  async ownersGuild(@Req() req: Request) {
    return this.usersService.ownersAndAdminsGuild(req);
  }
}
