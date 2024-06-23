import {
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  Snowflake,
} from 'discord.js';
import { en, ru } from './../../translations/';
import {
  SlashCommand,
  SubCommandGroupType,
  SubCommandType,
} from 'src/api/common/types';
import { Guilds } from 'src/api/modules/guilds-settings/guilds.schema';
import _ from 'lodash';
import { GuildSettingsService } from 'src/api/modules/guilds-settings/guilds.service';

export type DocumentationCommandsType = {
  name: string;
  description: string;
  type: number;
};

export class SlashCommandsActionsClass {
  private getLanguageCommands() {
    return {
      Russian: ru,
      English: en,
    };
  }

  private shouldExcludeCommand(fullCommandName: string, exclude?: string[]): boolean {
    return exclude ? exclude.includes(fullCommandName) : false;
  }

  private handleCommandInclusion(
    guild: Guilds,
    fullCommandName: string,
    commandsMap: Map<string, boolean>
  ) {
    if (guild.commands.has(fullCommandName)) {
      const commandFromDbMap = guild.commands.get(fullCommandName);
      commandsMap.set(fullCommandName, commandFromDbMap);
    } else {
      commandsMap.set(fullCommandName, true);
    }
  }

  private addSubcommand(
    commandBuilder: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder,
    subcommand: SubCommandType,
    guild: Guilds,
    exclude: string[],
    commandsMap: Map<string, boolean>,
    commandName: string,
    groupName?: string
  ) {
    if (subcommand.type > guild.premiumStatus) return;

    const fullCommandName = groupName
      ? `${commandName} ${groupName} ${subcommand.name}`
      : `${commandName} ${subcommand.name}`;

    if (this.shouldExcludeCommand(fullCommandName, exclude)) {
      commandsMap.set(fullCommandName, guild.commands.has(fullCommandName) ? false : false);
      return;
    }

    this.handleCommandInclusion(guild, fullCommandName, commandsMap);
    commandBuilder.addSubcommand(subcommand.builder);
  }

  public collectSlashCommands(guild: Guilds, exclude?: string[]) {
    const slashCommands: SlashCommandBuilder[] = [];
    const languageCommands = this.getLanguageCommands();
    const commandsMap = new Map<string, boolean>();

    for (const key of Object.keys(languageCommands)) {
      if (guild.commandLanguage !== key) continue;

      const commands = languageCommands[key] as SlashCommand[];
      for (const command of commands) {
        const commandName = command.name;
        const commandBuilder = _.cloneDeep(command.commandBuilder);
        let shouldAddCommand = false;

        if (command.groups) {
          for (const group of command.groups) {
            if (group.type > guild.premiumStatus) continue;

            const groupBuilder = _.cloneDeep(group.builder);
            for (const subcommand of group.subcommands) {
              this.addSubcommand(groupBuilder, subcommand, guild, exclude, commandsMap, commandName, group.name);
              shouldAddCommand = true;
            }

            commandBuilder.addSubcommandGroup(groupBuilder);
          }
        }

        if (command.subcommands) {
          for (const subcommand of command.subcommands) {
            this.addSubcommand(commandBuilder, subcommand, guild, exclude, commandsMap, commandName);
            shouldAddCommand = true;
          }
        }

        if (shouldAddCommand) {
          slashCommands.push(commandBuilder);
        }
      }
    }

    return { slashCommands, commandsMap };
  }

  public async commandRegister(
    guildId: string,
    clientId: Snowflake,
    service: GuildSettingsService,
    exclude?: string[],
  ) {
    const guild = await service.findByGuildId(guildId);
    const { slashCommands, commandsMap } = this.collectSlashCommands(guild, exclude);
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
      await Promise.allSettled([
        service.updateOne(guildId, { commands: commandsMap }),
        rest.put(Routes.applicationGuildCommands(clientId, guildId), {
          body: slashCommands.map((command) => command.toJSON()),
        }),
      ]);
    } catch (err) {
      console.error('Failed to register commands:', err);
      throw err;
    }
  }

  public collectCommandNames(language: string): DocumentationCommandsType[] {
    const languageCommands = this.getLanguageCommands();
    const commands = languageCommands[language];
    const response: DocumentationCommandsType[] = [];

    for (const command of commands) {
      const { name, description, type, subcommands, groups } = command;

      if (!groups && !subcommands) {
        response.push({ name, description, type });
      }

      if (groups) {
        for (const group of groups) {
          for (const subcommand of group.subcommands) {
            response.push({
              name: `${name} ${group.name} ${subcommand.name}`,
              description: subcommand.description,
              type: subcommand.type,
            });
          }
        }
      }

      if (subcommands) {
        for (const subcommand of subcommands) {
          response.push({
            name: `${name} ${subcommand.name}`,
            description: subcommand.description,
            type: subcommand.type,
          });
        }
      }
    }
    return response;
  }
}