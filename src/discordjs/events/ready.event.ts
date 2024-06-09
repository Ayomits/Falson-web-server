import { EventStructure } from 'src/discordjs/common/structure/event.structure';
import { INestApplicationContext } from '@nestjs/common';
import { Client, Events } from 'discord.js';
import { ReadySerivice } from './ready.service';

export class ReadyEvent extends EventStructure {
  name: string = Events.ClientReady;
  async execute(client: Client, app: INestApplicationContext) {
    const service = new ReadySerivice(client, app);
    await Promise.all([service.collectAllGuilds()]);
  }
}
