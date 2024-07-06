import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IsCache = (cacheable: boolean) =>
  SetMetadata(`cacheable`, cacheable);

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    const isCacheable = this.reflector.get<boolean>(
      `cacheable`,
      context.getHandler(),
    );
    if (isCacheable === false) {
      return undefined;
    }
    try {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      const { httpAdapter } = this.httpAdapterHost;

      const originalSend = res.send.bind(res);
      res.send = (body: any) => {
        try {
          if (!body) {
            return undefined;
          }
          res.send = originalSend;
          return originalSend(body);
        } catch {
          return undefined;
        }
      };

      return httpAdapter.getRequestUrl(req);
    } catch {
      return undefined;
    }
  }
}
