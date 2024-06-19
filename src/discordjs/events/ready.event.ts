import { EventStructure } from 'src/discordjs/common/structure/event.structure';
import { INestApplicationContext } from '@nestjs/common';
import { ActivityType, Client, Events } from 'discord.js';
import { ReadySerivice } from './ready.service';

export class ReadyEvent extends EventStructure {
  name: string = Events.ClientReady;
  async execute(client: Client, app: INestApplicationContext) {
    const service = new ReadySerivice(client, app);
    await Promise.all([service.collectAllGuilds()]);
    client.user.setPresence({
      status: `idle`,
    });
    const status = async () => {
      const guilds = await client.guilds.fetch();
      let membersCount: number = 0;
      for (const [_, guild] of guilds) {
        const fetchedGuild = await guild.fetch()
        membersCount += fetchedGuild.memberCount
      }
      client.user.setActivity({
        type: ActivityType.Playing,
        name: `С ${membersCount} участниками и ${guilds.size} серверами`,
      });
    };
    await status()
    setInterval(async () => {
      await status();
    }, 60_000);
  }
}
