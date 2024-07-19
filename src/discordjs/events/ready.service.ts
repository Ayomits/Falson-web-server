import { INestApplicationContext } from '@nestjs/common';
import { Client } from 'discord.js';
import { GuildSettingsService } from 'src/api/modules/private/guild-settings/GuildSettingsService';
import { VerificationService } from 'src/api/modules/private/verification/VerificationService';

export class ReadyService {
  client: Client;
  app: INestApplicationContext;
  constructor(client: Client, app: INestApplicationContext) {
    this.app = app;
    this.client = client;
  }

  async collectAllGuilds() {
    const verificationService = this.app.get(VerificationService);
    const guildService = this.app.get(GuildSettingsService);
    this.client.guilds.cache.map(async (guild) => {
      try {
        await Promise.allSettled([
          guildService.createOrUpdate({ guildId: guild.id }),
          verificationService.createDefaultSettings(guild.id),
        ]);
      } catch {}
    });
  }
}
