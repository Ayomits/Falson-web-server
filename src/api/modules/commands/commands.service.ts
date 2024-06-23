import { Cache } from '@nestjs/cache-manager';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LanguagesEnum } from 'src/api/common/types';
import {
  DocumentationCommandsType,
  SlashCommandsActionsClass,
} from 'src/discordjs/events/interaction.collector';

@Injectable()
export class CommandsService {
  constructor(private cacheManager: Cache) {}

  private slashCommandAction: SlashCommandsActionsClass =
    new SlashCommandsActionsClass();

  getCommandsByLanguage(language: string) {
    const commandsFromCache = this.cacheManager.get(`${language}-commands`);
    if (commandsFromCache) {
      return commandsFromCache;
    }
    const commands = this.slashCommandAction.collectCommandNames(
      language.toUpperCase(),
    );
    if (!commands)
      throw new BadRequestException(
        `Invalid language. Available languages: English, Russian`,
      );
    this.cacheManager.set(`${language}-commands`, commandsFromCache);
    return commands;
  }

  getCommandByName(language: string, name: string) {
    const commandFromCache = this.cacheManager.get(`command-${name}`);
    if (commandFromCache) {
      return commandFromCache;
    }
    const commands = this.getCommandsByLanguage(
      language,
    ) as DocumentationCommandsType[];
    const command = commands.find((command) => command.name === name);
    if (command) {
      this.cacheManager.set(`command-${name}`, command);
      return command;
    }
    throw new BadRequestException(`This command doesn't exists`);
  }
}
