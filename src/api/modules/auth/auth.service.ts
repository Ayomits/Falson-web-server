/**
 * ПОКА ЧТО НЕ ГОТОВО
 * ОСТАЛОСЬ ПОДУМАТЬ НАД ТОКЕНАМИ
 */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs/index';
import { Request, Response } from 'express';
import axios from 'axios';
import * as querystring from 'querystring';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/api/common/types/base.types';
import crypto from 'crypto';
import { Users } from '../users/users.schema';

@Injectable()
export class AuthService {
  public clientService: ClientFetcher = new ClientFetcher(client);

  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async getTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: process.env.ACCESS_SECRET_KEY,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: process.env.REFRESH_SECRET_KEY,
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  /**
   * Создание ссылки для авторизации
   */
  generateLoginDiscordLink() {
    const baseUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.clientService.client.application.id}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;

    const scopes = process.env.SCOPES || '["guilds", "identify", "email"]';
    const scopesFromEnv = JSON.parse(scopes) as string[];
    const scopeString = scopesFromEnv.join('+');

    return `${baseUrl}&scope=${scopeString}`;
  }

  /**
   * Редирект на авторизацию пользователя
   */
  login(res: Response) {
    return res.redirect(this.generateLoginDiscordLink());
  }
  /**
   * Обработка колбэка и авторизация пользователя
   */
  async handleCallback(req: Request, res: Response) {
    const code = req.query.code as string;

    try{
      /**
     * Обмениваем код на 2 токена
     * Refresh и Access
     * P.s. код это то, что в ссылке
     * аля ?code=цифрыбуквыит.д.клейпидорас
     * и вот это обмениваем
     */
    const tokens = await this.fetchTokens(code);
    /**
     * Нам отсюда по факту-то нужен только userId))
     */
    const userData = await this.usersService.fetchUserData({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    /**
     * Большая объяснялка для читающего этот код
     * У нас есть 2 типа токенов (именно тут)
     * 1) Токены дискорда для получения инфы. Как-либо шифровать их нет смысла, если нас взломают, люди получат информацию херни
     * 2) Наши токены для авторизации, того же типа, что и у дискорда, но это доступ к нашему серверу - хешируем
     *
     */
    const authTokens = await this.getTokens({
      userId: userData.id,
    });
    /**
     * createOrUpdate
     * Если есть пользователь - обновить
     * Нет - создать
     * Логично
     */

    const encryptedRefresh = this.encrypt(authTokens.refreshToken)
    return await Promise.allSettled([
      /**
       * Посылаем токены НАШЕГО сервиса человеку в куки. Получить инфу по юзеру можно будет через 1 из наших токенов для получения других токенов для дс API
       */

      res.cookie('accessToken', authTokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 минут
      }),

      res.cookie('refreshToken', encryptedRefresh, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      }),
      
      this.usersService.createOrUpdate({
        userId: userData.id,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        refreshToken: encryptedRefresh,
      }),
      res.redirect(
        `${process.env.FRONTEND_URL}`,
      ),
    ]);
    }catch(err){
      console.log(err)
    }
  }

  async exchangeRefreshToAccess(refreshToken: string) {
    const decryptedToken = this.decrypt(refreshToken);
    const jwtData = this.jwtService.verify(decryptedToken);
    const user = (await this.usersService.findByUserId(
      jwtData.userId,
    )) as Users;
    if (!user) {
      throw new BadRequestException(`This user doesn't exits`);
    }
    const tokens = await this.getTokens({ userId: user.userId });
    return { accessToken: tokens.accessToken };
  }

  /**
   * Могло бы понадобится гард
   */
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(String(process.env.CRYPTO_KEY).slice(0, 32)),
      iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }
  /**
   * Могло бы понадобится гард
   */
  private decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(String(process.env.CRYPTO_KEY).slice(0, 32)),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
  /**
   *  Сборы пары accessToken и refreshToken для сбора информации о пользователе (DISCORD)
   */
  private async fetchTokens(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    /**
     * То, что будет в body запроса
     * Для получения данных
     *
     */
    const data = {
      client_id: this.clientService.client.application.id,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      scope: JSON.parse(process.env.SCOPES).join(' '), // join scopes with space for token request
    };

    /**
     * Я тоже хочу научится OAUTH2 делать, но видимо ещё маленький для него
     */
    const req = await axios.post(
      'https://discord.com/api/oauth2/token',
      querystring.stringify(data),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    /**
     * Выдаёт нам доступ к users/@me и users/@me/guilds
     * Как-то так...
     */
    return {
      accessToken: req.data?.access_token,
      refreshToken: req.data?.refresh_token,
    };
  }
}
