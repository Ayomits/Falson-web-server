import { Client, Events } from 'discord.js';
import { EventStructure } from '../common/structure/event.structure';
import { INestApplicationContext } from '@nestjs/common';
import { VerificationService } from 'src/api/modules/verification/verification.service';
import { GuildSettingsService } from 'src/api/modules/guild-settings/guild-settings.service';
import mongoose from 'mongoose';
import { GuildType, SchemasName } from 'src/api/common';
import { GuildSchema } from 'src/api/modules/guild-settings/schemas/guilds.schema';

export class ReadyEvent extends EventStructure {
  name: string = Events.ClientReady;

  async execute(client: Client, app: INestApplicationContext) {
    const verificationService = app.get(VerificationService);
    const guildService = app.get(GuildSettingsService);
    const allGuildsFromDb = (await guildService.findAll()).map(
      (guild) => guild.guildId,
    );
    const model = mongoose.model(SchemasName.Guilds, GuildSchema);
    const newGuilds = client.guilds.cache
      .filter((guild) => !allGuildsFromDb.includes(guild.id))
      .map((guild) => {
        return new model({ guildId: guild.id, type: GuildType.Everyone });
      });
    await guildService.insertMany(newGuilds)
  }
}
