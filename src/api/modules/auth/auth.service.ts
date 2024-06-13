/**
 * ПОКА ЧТО НЕ ГОТОВО
 * ОСТАЛОСЬ ПОДУМАТЬ НАД ТОКЕНАМИ
 */

import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs/index';
import { query, Request, Response } from 'express';
import axios from 'axios';
import * as querystring from 'querystring';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  public clientService: ClientFetcher = new ClientFetcher(client);

  constructor(@Inject(UsersService) private usersService: UsersService) {}
  generateLoginDiscordLink() {
    // Algorithm to generate Discord OAuth2 link
    const baseUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.clientService.client.application.id}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;

    const scopes = process.env.SCOPES || '["guilds", "identify", "email"]';
    const scopesFromEnv = JSON.parse(scopes) as string[];
    const scopeString = scopesFromEnv.join('+');

    return `${baseUrl}&scope=${scopeString}`;
  }

  login(res: Response) {
    return res.redirect(this.generateLoginDiscordLink());
  }

  async handleCallback(req: Request, res: Response) {
    const code = req.query.code as string;
    const tokens = await this.fetchTokens(code);
    const headers = {
      Authorization: `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json',
    };
    const userData = await this.fetchUserData(headers);
    const newUser = await this.usersService.create({
      userId: userData.userId,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      username: userData.username
    });
    return res.redirect(`${process.env.FRONTEND_URL}`);
  }

  private async fetchTokens(code: string): Promise<any> {
    const data = {
      client_id: this.clientService.client.application.id,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      scope: JSON.parse(process.env.SCOPES).join(' '), // join scopes with space for token request
    };

    const req = await axios.post(
      'https://discord.com/api/oauth2/token',
      querystring.stringify(data),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return {
      accessToken: req.data?.access_token,
      refreshToken: req.data?.refresh_token,
    };
  }
  private async fetchUserData(headers: {
    Authorization: string;
    'Content-Type': string;
  }) {
    try {
      const query = await axios.get('https://discord.com/api/users/@me', {
        headers: headers,
      });
      return query.data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
