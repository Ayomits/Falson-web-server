import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class IsBotGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      if (request.headers['x-bot-token'] === process.env.TOKEN) return true;
      return false;
    } catch {
      return false;
    }
  }
}
