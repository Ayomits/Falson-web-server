import {
  CanActivate,
  ExecutionContext,
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';


/**
 * Я долго думал (нет)
 * Клиент, тобишь клей и я будем сами ебаться с тем чтобы при помощи refreshToken получать новый
 * Если токен экспарнулся, просто клиент будет чуть дольше мучаться
 * Ну как-то пихуй
 * между 400 и 500 милисекунд разница не большая
 */
export class IsAuthGuard implements CanActivate {

  constructor(@Inject(JwtService) private jwtService: JwtService){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    try {
      const accessToken = request.cookies.accessToken
      const user = await this.jwtService.verify(accessToken, {secret: process.env.ACCESS_SECRET_KEY})
      if (!user){
        return false
      }
      request.user = user
      return true
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException(err)
    }
  }
}
