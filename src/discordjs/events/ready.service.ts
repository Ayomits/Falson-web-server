import {
  Guilds,
  GuildsSchema,
} from 'src/api/modules/guilds-settings/guilds.schema';
import { INestApplicationContext } from '@nestjs/common';
import {
  Client,
  Guild,
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import { GuildSettingsService } from 'src/api/modules/guilds-settings/guilds.service';
import { PremiumEnum } from 'src/api/common/types/base.types';
import mongoose, { Model } from 'mongoose';
import { VerificationService } from 'src/api/modules/verification/verification.service';
import {
  Verification,
  VerificationSchema,
} from 'src/api/modules/verification/verification.schema';
import { collectCommands, SlashComandType } from './interactionCollector';

export class ReadySerivice {
  client: Client;
  app: INestApplicationContext;
  constructor(client: Client, app: INestApplicationContext) {
    this.client = client;
    this.app = app;
  }
  async updateGuildCommands(allGuilds: any, exclude: string[]) {
    const updates = [];

    this.commandRegister('1160357823834751097', ['bot2']);
    try {
      await Promise.all(updates);
      console.log('All guild commands updated successfully');
    } catch (error) {
      console.error('Error updating guild commands:', error);
    }
  }
  /**
   *
   * @param guildId
   * @param exclude - массив в котором хранятся ключи, что нужно перевести в false
   */
  async commandRegister(guildId: string, exclude: string[]) {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const commands = collectCommands() as SlashComandType[];
    const service = this.app.get(GuildSettingsService);
    const slashCommands = [] as SlashCommandBuilder[];
    const guildFromDb = (await service.findByGuildId(guildId)) as Guilds;
    for (const command of commands.filter(
      (command) => command.language === guildFromDb.commandLanguage,
    )) {
      const { type, commandBuilder, subCommands } = command;
      if (type > guildFromDb.premiumStatus) continue;
      if (subCommands) {
        let subCommandGroup = null;
        for (const subCommand of subCommands) {
          if (subCommand.type > guildFromDb.premiumStatus) continue;
          if (
            subCommand.builder instanceof SlashCommandSubcommandGroupBuilder
          ) {
            subCommandGroup = new SlashCommandSubcommandGroupBuilder()
              .setName(subCommand.builder.name)
              .setDescription(subCommand.builder.description);
            commandBuilder.addSubcommandGroup(subCommandGroup);
          } else {
            if (subCommandGroup) {
              subCommandGroup.addSubcommand(subCommand.builder);
              subCommandGroup = null;
            } else {
              commandBuilder.addSubcommand(subCommand.builder);
            }
          }
        }
      }
      slashCommands.push(commandBuilder);
    }
    const commandsMap = new Map<string, boolean>();
    const filtredSlashCommadns = slashCommands.filter((command) => {
      const subCommandGroup = command.options.find(
        (option) => option.toJSON().type === 2,
      );
      const subCommand = command.options.find(
        (option) => option.toJSON().type === 1,
      );

      const commandName = `${command.name}${subCommandGroup ? ` ${subCommandGroup?.toJSON().name}` : ''}${subCommand ? ` ${subCommand.toJSON().name}` : ''}`;

      if (exclude.includes(commandName)) {
        commandsMap.set(commandName, false)
        return false
      }
      if (guildFromDb.commands.has(commandName)) {
        const commandFromDb = guildFromDb.commands.get(commandName)
        commandsMap.set(commandName, commandFromDb)
        if (!commandFromDb) {
          return false
        }
      }else {
        commandsMap.set(commandName, true)
      }
      return true
    });

    try {
      await Promise.allSettled([
        service.updateOne(guildId, { commands: commandsMap }),
        rest.put(
          Routes.applicationGuildCommands(guildId, this.client.user.id),
          {
            body: filtredSlashCommadns.map((command) => {
              return command.toJSON();
            }),
          },
        ),
      ]);
    } catch {}
  }
  async collectAllGuilds(_allGuilds: Guilds[]) {
    const guildsService = this.app.get(GuildSettingsService);
    const verificationService = this.app.get(VerificationService);
    const [allGuidls, verifications] = await Promise.all([
      guildsService.findAll(),
      verificationService.findAll(),
    ]);

    const guildsModel: Model<any> = mongoose.model<any>(
      Guilds.name.toLowerCase(),
      GuildsSchema,
    );
    const verificationModel: Model<any> = mongoose.model<any>(
      Verification.name,
      VerificationSchema,
    );

    const guilds = this.client.guilds.cache.map((guild) => guild.id);
    const existedGuilds = allGuidls.map((guild) => guild.guildId);
    const existedVerifications = verifications.map(
      (verification) => verification.guildId,
    );
    const newVerifications = guilds.filter(
      (guild) => !existedVerifications.includes(guild),
    );
    const newGuilds = guilds.filter((guild) => !existedGuilds.includes(guild));
    const newGuildsDocs = newGuilds.map((guild) => {
      return new guildsModel({
        guildId: guild,
        premiumStatus: PremiumEnum.NoPrem,
      });
    });
    const newVerificationsDoc = newVerifications.map((verification) => {
      return new verificationModel({
        guildId: verification,
      });
    });
    return await Promise.all([
      guildsService.insertMany(newGuildsDocs),
      verificationService.insertMany(newVerificationsDoc),
    ]);
  }
}
