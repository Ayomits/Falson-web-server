import { Cache } from '@nestjs/cache-manager';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LanguagesEnum, SchemasName } from 'src/api/common/types';
import {
  DocumentationCommandsType,
  SlashCommandsActionsClass,
} from 'src/discordjs/events/interaction.collector';
import { GuildCommand } from './schemas/commands.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommandsService {
  constructor(
    private cacheManager: Cache,
    @InjectModel(SchemasName.GuildCommands)
    private guildCommandModel: Model<GuildCommand>,
  ) {}

  private slashCommandAction: SlashCommandsActionsClass =
    new SlashCommandsActionsClass();

  /**
   * Для документации к командам
   */
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

  /**
   * Для документации к командам
   */
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

  /**
   * Для фичи команд
   */
  async getCommandSettings(guildId: string, commandName: string) {
    return await this.guildCommandModel.findOne({ guildId, commandName });
  }

  /**
   * Для фичи команд
   */
  async allCommands(guildId: string) {
    return await this.guildCommandModel.find({ guildId });
  }
}
