import {
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
   * body {
   *  token: "e2e.unit.integration"
   * }
   */
  @Post(`/token`)
  async getAccessByRefresh(@Req() req: Request, @Res() res: Response) {
    return await this.authService.exchangeRefreshToAccess(
      req,
      res
    );
  }

  @Post(`/check-auth`)
  async checkAuth() {
    return true
  }
}
