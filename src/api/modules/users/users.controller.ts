import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs';
import { Request } from 'express';
import { JwtPayload } from 'src/api/common/types/base.types';

@Controller('users')
export class UsersController {
  clientFetcher = new ClientFetcher(client);
  constructor(@Inject(UsersService) private usersService: UsersService) {}

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
