import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    try {
      const req = context.switchToHttp().getRequest() as Request;
      const { httpAdapter } = this.httpAdapterHost;

      if (req.url.includes(`/auth/discord/callback`) && req.method === 'GET') {
        return undefined;
      }

      return httpAdapter.getRequestUrl(req);
    } catch {}
  }
}
