import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';

import { client } from 'src/discordjs/index';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

/**
 * Публичный контроллер
 */
@Controller('auth')
export class AuthController {
  clientService = new ClientFetcher(client);

  constructor(@Inject() private authService: AuthService) {}

  /**
   * Публичный эндпоинт
   */
  @Get('/discord/login')
  login(@Res() res: Response) {
    return this.authService.login(res);
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
   */
  @Post(`/token`)
  async getAccessByRefresh(@Body() token: { token: string }) {
    return await this.authService.exchangeRefreshToAccess(token.token);
  }
}
