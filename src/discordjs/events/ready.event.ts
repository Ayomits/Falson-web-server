import { EventStructure } from 'src/discordjs/common/structure/event.structure';
import { INestApplicationContext } from '@nestjs/common';
import { Client, Events, Guild } from 'discord.js';
import { ReadySerivice } from './ready.service';
import { GuildSettingsService } from 'src/api/modules/guilds-settings/guilds.service';
export class ReadyEvent extends EventStructure {
  name: string = Events.ClientReady;
  async execute(client: Client, app: INestApplicationContext) {
    const service = new ReadySerivice(client, app);
    const guildService = app.get(GuildSettingsService);
    const allGuilds = await guildService.findAll();
    await service.collectAllGuilds(allGuilds)
    await service.registerAllGuilds()
  }
}
