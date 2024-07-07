import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IsCache = (cacheable: boolean) =>
  SetMetadata(`cacheable`, cacheable);

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    return undefined
  }
}
