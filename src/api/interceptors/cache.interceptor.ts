import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { httpAdapter } = this.httpAdapterHost;

    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      if (!body) {
        return undefined;
      }
      res.send = originalSend; 
      return originalSend(body);
    };

    return httpAdapter.getRequestUrl(req);
  }
}
