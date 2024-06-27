import { Client, Events } from 'discord.js';
import { EventStructure } from '../common/structure/event.structure';
import { INestApplicationContext } from '@nestjs/common';
import { VerificationService } from 'src/api/modules/verification/verification.service';
import { GuildSettingsService } from 'src/api/modules/guild-settings/guild-settings.service';
import mongoose from 'mongoose';
import { GuildType, SchemasName } from 'src/api/common';
import { GuildSchema } from 'src/api/modules/guild-settings/schemas/guilds.schema';
import { ReadyService } from './ready.service';

export class ReadyEvent extends EventStructure {
  name: string = Events.ClientReady;

  async execute(client: Client, app: INestApplicationContext) {
   const service = new ReadyService(client, app)
   await service.collectAllGuilds()
   await service.allGuildsRegister()
  }
}
