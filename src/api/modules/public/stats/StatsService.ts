import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/api/abstractions/AbstractService';
import { client } from 'src/discordjs/main';

@Injectable()
export class StatsService extends AbstractService {
  botStats(): { guildCount: number; members: number } {
    const guilds = this.clientFetcher.getAllGuildsFromCache();
    let memberCount: number = 0;
    for (const [_, guild] of guilds) {
      memberCount += guild.memberCount;
    }

    return {
      guildCount: guilds.size,
      members: memberCount,
    };
  }
}
