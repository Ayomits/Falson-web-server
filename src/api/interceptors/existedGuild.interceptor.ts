import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientFetcher } from '../common/functions/clientFetcher.class';
import { client } from 'src/discordjs';

@Injectable()
export class ExistedGuildInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const clientFetcher = new ClientFetcher(client);
    const request = context.switchToHttp().getRequest();
    const guildId = request.params.guildId || request.body.guildId;
    const guildFromCache = clientFetcher.getGuildFromCache(guildId);
    if (!guildFromCache) {
      throw new BadRequestException(`Our bot has not access to this guild`);
    }
    return next.handle();
  }
}
