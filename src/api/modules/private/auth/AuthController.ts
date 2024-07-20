import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { client } from 'src/discordjs/main';
import { AuthService } from './AuthService';
import { Request, Response } from 'express';
import { AbstractController } from 'src/api/abstractions/AbstractController';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';
import { RouteType } from 'src/api/types/RouteType';

/**
 * Публичный контроллер
 */
@Controller('auth')
@RouteProtectLevel(RouteType.USER_ONLY)
export class AuthController extends AbstractController {
  constructor(@Inject() private authService: AuthService) {
    super();
  }

  /**
   * Публичный эндпоинт
   */
  @Get('/discord/login')
  @RouteProtectLevel(RouteType.PUBLIC)
  login(@Res() res: Response) {
    return this.authService.login(res);
  }

  @Get(`/discord/invite`)
  @RouteProtectLevel(RouteType.PUBLIC)
  invite(@Res() res: Response) {
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${this.clientFetcher.client.user.id}&permissions=8&integration_type=0&scope=bot`,
    );
  }

  @Get(`/discord/:guildId/invite`)
  @RouteProtectLevel(RouteType.PUBLIC)
  inviteToGuild(@Res() res: Response, @Param('guildId') guildId: string) {
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${this.clientFetcher.client.user.id}&guild_id=${guildId}&permissions=8&integration_type=0&scope=bot`,
    );
  }

  /**
   * Публичный эндпоинт
   */
  @Get('/discord/callback')
  @RouteProtectLevel(RouteType.PUBLIC)
  callback(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleCallback(req, res);
  }

  /**
   * Публичный эндпоинт
   * body {
   *  token: "e2e.unit.integration"
   * }
   */
  @Post(`/token`)
  @RouteProtectLevel(RouteType.PUBLIC)
  getAccessByRefresh(@Body(`token`) token: string, @Res() res: Response) {
    return this.authService.exchangeRefreshToAccess(token, res);
  }
}
