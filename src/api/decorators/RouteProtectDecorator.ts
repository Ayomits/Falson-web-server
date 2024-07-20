import { SetMetadata } from '@nestjs/common';
import { RouteType } from '../types/RouteType';

/**
 * Дабы не плодить куча гард
 * Сделан 1 единственный метод защиты роутов
 */
export const RouteProtectLevel = (requestType: RouteType) =>
  SetMetadata(`RequestType`, requestType);
