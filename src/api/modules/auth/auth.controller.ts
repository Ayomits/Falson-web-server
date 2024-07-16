import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/';
import { client } from 'src/discordjs/main';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { IsCache } from 'src/api/interceptors';

/**
 * Публичный контроллер
 */
@Controller('auth')
export class AuthController {
  private clientService: ClientFetcher = new ClientFetcher(client);

  constructor(@Inject() private authService: AuthService) {}

  /**
   * Публичный эндпоинт
   */
  @Get('/discord/login')
  @IsCache(true)
  login(@Res() res: Response) {
    return this.authService.login(res);
  }

  @Get(`/discord/invite`)
  invite(@Res() res: Response) {
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${this.clientService.client.user.id}&permissions=8&integration_type=0&scope=bot`,
    );
  }

  /**
   * Публичный эндпоинт
   */
  @Get('/discord/callback')
  @IsCache(false)
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
