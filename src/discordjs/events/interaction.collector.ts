import {
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  Snowflake,
} from 'discord.js';
import { en, ru } from './../../translations/';
import { GuildType, LanguagesEnum, SlashCommand } from 'src/api/common/types';
import _ from 'lodash';
import { client } from '../main';
import { Guild as GuildDocument } from 'src/api/modules/guild-settings/schemas/guilds.schema';
import { INestApplicationContext } from '@nestjs/common';
import { CommandsService } from 'src/api/modules/commands/commands.service';

export type DocumentationCommandsType = {
  name: string;
  description: string;
  type: number;
};

export class SlashCommandsActionsClass {
  private getLanguageCommands() {
    return {
      russian: ru,
      english: en,
    };
  }

  public async collectAllComands(
    guild: GuildDocument,
    app: INestApplicationContext,
  ) {
    const allCommands = this.getLanguageCommands();
    const commands = allCommands[
      guild.commandLanguage.toLowerCase()
    ] as SlashCommand[];
    const commandService = app.get(CommandsService);
    const allGuildCommands = await commandService.allCommands(guild.guildId);
    const slashCommands = [[], [], []] as [
      SlashCommandBuilder[],
      string[],
      string[],
    ];
    for (const command of commands) {
      const commandFromDb = allGuildCommands.find(
        (c) => c.commandName === command.dbName,
      );
      if (guild.type < command.type) {
        if (commandFromDb) {
          slashCommands[2].push(commandFromDb.commandName);
        }
        continue;
      }
      const commandBuilder = _.clone(command.commandBuilder);

      if (commandFromDb) {
        if (commandFromDb.isEnabled) {
          slashCommands[0].push(commandBuilder);
        }
        continue;
      } else {
        slashCommands[1].push(command.dbName);
        slashCommands[0].push(commandBuilder);
      }
    }
    return slashCommands;
  }

  public findCommandByName(commandName: string, language: LanguagesEnum) {
    const allCommands = this.getLanguageCommands();
    const commands = allCommands[language.toLowerCase()] as SlashCommand[];
    return commands.find((command) => command.name === commandName);
  }

  public collectCommandNames(language: string): DocumentationCommandsType[] {
    const languageCommands = this.getLanguageCommands();
    const commands = languageCommands[language.toLowerCase()] as SlashCommand[];
    const filtered = commands
      .filter((command) => command.type < GuildType.Developer)
      .map((command) => {
        const { name, description, type } = command;
        const response = { name, description, type };
        return response;
      });
    return filtered;
  }

  async commandRegister(guildID: string, commands: SlashCommandBuilder[]) {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
      await rest.put(Routes.applicationGuildCommands(client.user.id, guildID), {
        body: commands,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param commands Названия команд, что нужно удалить
   */
  async commandDelete(commands: string[], guildId: string) {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
      const guild = client.guilds.cache.get(guildId);
      const applicationCommands = guild.commands.cache.filter((command) =>
        commands.includes(command.name),
      );
      for (const [_, applicationCommand] of applicationCommands) {
        await rest.delete(
          Routes.applicationGuildCommand(
            client.user.id,
            guildId,
            applicationCommand.id,
          ),
        );
      }
    } catch (err) {
      throw err;
    }
  }
}
