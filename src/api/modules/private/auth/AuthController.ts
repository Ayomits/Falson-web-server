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

/**
 * Публичный контроллер
 */
@Controller('auth')
export class AuthController extends AbstractController {
  constructor(@Inject() private authService: AuthService) {
    super();
  }

  /**
   * Публичный эндпоинт
   */
  @Get('/discord/login')
  login(@Res() res: Response) {
    return this.authService.login(res);
  }

  @Get(`/discord/invite`)
  invite(@Res() res: Response) {
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${this.clientFetcher.client.user.id}&permissions=8&integration_type=0&scope=bot`,
    );
  }

  @Get(`/discord/:guildId/invite`)
  inviteToGuild(@Res() res: Response, @Param('guildId') guildId: string) {
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${this.clientFetcher.client.user.id}&guild_id=${guildId}&permissions=8&integration_type=0&scope=bot`,
    );
  }

  /**
   * Публичный эндпоинт
   */
  @Get('/discord/callback')
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
  getAccessByRefresh(@Body(`token`) token: string, @Res() res: Response) {
    return this.authService.exchangeRefreshToAccess(token, res);
  }
}
