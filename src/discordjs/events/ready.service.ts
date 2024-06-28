import { INestApplicationContext } from '@nestjs/common';
import { Client } from 'discord.js';
import mongoose from 'mongoose';
import { GuildType, SchemasName } from 'src/api';
import { GuildSettingsService } from 'src/api/modules/guild-settings/guild-settings.service';
import { GuildSchema } from 'src/api/modules/guild-settings/schemas/guilds.schema';
import { VerificationService } from 'src/api/modules/verification/verification.service';
import { SlashCommandsActionsClass } from './interaction.collector';
import { CommandsService } from 'src/api/modules/commands/commands.service';
import { GuildCommandSchema } from 'src/api/modules/commands/schemas';
import { logger } from '../common';

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
    const allGuildsFromDb = (await guildService.findAll()).map(
      (guild) => guild.guildId,
    );
    const allVerificationFromDb = (await verificationService.findAll()).map(
      (verification) => verification.guildId,
    );

    const model = mongoose.model(SchemasName.Guilds, GuildSchema);
    const [newGuilds, _] = await Promise.all([
      this.client.guilds.cache
        .filter((guild) => !allGuildsFromDb.includes(guild.id))
        .map((guild) => {
          return new model({ guildId: guild.id, type: GuildType.Everyone });
        }),
      this.client.guilds.cache
        .filter((guild) => !allVerificationFromDb.includes(guild.id))
        .map(async (guild) => {
          return await verificationService.createDefaultSettings(guild.id);
        }),
    ]);
    await guildService.insertMany(newGuilds);
  }

  @logger(
    `Начинаю регистрацию команд для каждой гильдии`,
    `Закончил регистрацию для каждой гильдии`,
  )
  async allGuildsRegister() {
    const commandAction = new SlashCommandsActionsClass();
    const commandService = this.app.get(CommandsService);
    const guildService = this.app.get(GuildSettingsService);
    const model = mongoose.model(SchemasName.GuildCommands, GuildCommandSchema);
    for (const [_, guild] of this.client.guilds.cache) {
      const guildFromDb = await guildService.findByGuildId(guild.id);
      const commands = await commandAction.collectAllComands(
        guildFromDb,
        this.app,
      );
      await commandAction.commandRegister(guild.id, commands[0]);
      if (commands[1].length >= 1) {
        commandService.insertMany(
          commands[1].map((command) => {
            return new model({
              guildId: guild.id,
              commandName: command,
              isEnabled: true,
            });
          }),
        );
        commandService.disableMany(guild.id, commands[2])
      }
    }
  }

}
