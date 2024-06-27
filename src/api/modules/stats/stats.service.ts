import { Injectable } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs/main';

@Injectable()
export class StatsService {

  clientFetcher: ClientFetcher = new ClientFetcher(client)

  async botStats(): Promise<{guildCount: number, members: number}> {
    const guilds = this.clientFetcher.getAllGuildsFromCache()
    let memberCount: number = 0
    for (const [_, guild] of guilds) {
      memberCount += guild.memberCount
    }

    return {
      guildCount: guilds.size,
      members: memberCount
    }
  }
}
