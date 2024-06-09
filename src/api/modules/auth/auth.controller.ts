import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';

import { client } from 'src/discordjs/index';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  clientService = new ClientFetcher(client);

  constructor(@Inject() private authService: AuthService) {}

  @Get('/discord/login')
  login(@Res() res: Response) {
    return this.authService.login(res);
  }

  @Get('/discord/callback')
  callback(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleCallback(req, res)
  }
}
