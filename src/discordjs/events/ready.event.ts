import { Client, Events } from 'discord.js';
import { EventStructure } from '../common/structure/event.structure';
import { INestApplicationContext } from '@nestjs/common';
import { ReadyService } from './ready.service';

export class ReadyEvent extends EventStructure {
  name: string = Events.ClientReady;

  async execute(client: Client, app: INestApplicationContext) {
   const service = new ReadyService(client, app)
   await service.collectAllGuilds()
  }
}
