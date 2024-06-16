import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Реализовать гарду авторизированного пользователя
export class IsAuthGuard implements CanActivate {

  constructor(@Inject(JwtService) private jwtService: JwtService){}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    try {
      const headers = request.headers
      const authorization = headers.authorization
      const token = authorization.split(' ')[1]
      const user = this.jwtService.verify(token)
      if (!user){
        return false
      }
      request.user = user
      return true
    } catch {
      throw new UnauthorizedException(`Unauthorized 401`);
    }
  }
}
