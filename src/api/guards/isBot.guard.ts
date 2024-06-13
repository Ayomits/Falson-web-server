// Реализовать гарду, что проверяет токен

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsBotGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers["x-bot-token"];
    if (token === process.env.TOKEN) {
      return true;
    }
    return false;
  }
}
