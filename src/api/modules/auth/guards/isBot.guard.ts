import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class IsBotGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    try {
      const headers = req.headers;
      const botToken = headers['x-bot-token'];
      if (botToken === process.env.TOKEN) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
