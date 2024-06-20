import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';

import { client } from 'src/discordjs/index';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { IsAuthGuard } from './guards/isAuth.guard';

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

  @Post(`logout`)
  @UseGuards(IsAuthGuard)
  async logout(@Req() req: Request) {
    return this.authService.logout(req)
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
  async getAccessByRefresh(@Body() token: { token: string }) {
    return await this.authService.exchangeRefreshToAccess(token.token);
  }
}
