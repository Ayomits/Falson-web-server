import {
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  Snowflake,
} from 'discord.js';
import { en, ru } from './../../translations/';
import {
  GuildCommandType,
  SlashCommand,
  SubCommandGroupType,
  SubCommandType,
} from 'src/api/common/types';

import _ from 'lodash';

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
