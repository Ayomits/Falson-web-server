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
import { CommandDto } from './dto/command.dto';
import { GuildSettingsService } from '../guild-settings/guild-settings.service';

@Injectable()
export class CommandsService {
  constructor(
    private cacheManager: Cache,
    @InjectModel(SchemasName.GuildCommands)
    private guildCommandModel: Model<GuildCommand>,
    private guildService: GuildSettingsService,
  ) {}

  private slashCommandAction: SlashCommandsActionsClass =
    new SlashCommandsActionsClass();

  /**
   * Для документации к командам
   */
  async getCommandsByLanguage(language: string) {
    const commandsFromCache = await this.cacheManager.get(
      `${language}-commands`,
    );
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
    await this.cacheManager.set(`${language}-commands`, commands);
    return commands;
  }

  /**
   * Для документации к командам
   */
  async getCommandByName(
    language: string,
    name: string,
  ): Promise<DocumentationCommandsType> {
    const commandFromCache =
      await this.cacheManager.get<DocumentationCommandsType>(`command-${name}`);
    if (commandFromCache) {
      return commandFromCache;
    }
    const commands = (await this.getCommandsByLanguage(
      language,
    )) as DocumentationCommandsType[];
    const command = commands.find((command) => command.name === name);
    if (command) {
      await this.cacheManager.set(`command-${name}`, command);
      return command;
    }
    throw new BadRequestException(`This command doesn't exists`);
  }

  /**
   * Для фичи команд
   */

  async fetchCommand(guildId: string, commandName: string) {
    return await this.guildCommandModel.findOne({ guildId, commandName });
  }

  /**
   * Для фичи команд
   */
  async allCommands(guildId: string) {
    return await this.guildCommandModel.find({ guildId });
  }

  async getCommandSettings(guildId: string, commandName: string) {
    const commandFromCache = await this.cacheManager.get<GuildCommand>(
      `${guildId}-${commandName}`,
    );
    if (commandFromCache) {
      return commandFromCache;
    }
    const commandFromDb = await this.fetchCommand(guildId, commandName);
    if (commandFromDb) {
      await this.cacheManager.set(`${guildId}-${commandName}`, commandFromDb);
    }
    return commandFromDb;
  }

  async create(dto: CommandDto) {
    const existedCommand = await this.getCommandSettings(
      dto.guildId,
      dto.commandName,
    );
    if (existedCommand)
      throw new BadRequestException(`This command already exists`);
    const newCommand = await this.guildCommandModel.create(dto);
    await this.cacheManager.set(
      `${dto.guildId}-${dto.commandName}`,
      newCommand,
    );
    return newCommand;
  }

  /**
   * Отвечает за настройки команды
   * Роли и т.п.
   */
  async updateCommand(guildID: string, commandName: string, dto: CommandDto) {
    const guild = await this.guildService.findByGuildId(guildID);
    const existedCommand = await this.getCommandSettings(guildID, commandName);
    if (!existedCommand)
      throw new BadRequestException(`This command does not exists`);
    const commandFromDocs = await this.getCommandByName(
      guild.commandLanguage,
      commandName,
    );
    const newSettings = await this.guildCommandModel.findByIdAndUpdate(
      existedCommand._id,
      {
        ...dto,
        guildId: guildID,
        isEnabled: guild.type >= commandFromDocs.type ? dto.isEnabled : false,
      },
      { new: true },
    );
    await this.cacheManager.set(`${guildID}-${commandName}`, newSettings);
    return newSettings;
  }

  async disableCommand(guildId: string, commandName: string) {
    const existedCommand = await this.getCommandSettings(guildId, commandName);
    if (!existedCommand)
      throw new BadRequestException(`This command does not exists`);
    await Promise.all([
      this.updateCommand(guildId, commandName, { isEnabled: false }),
      this.slashCommandAction.commandDelete([commandName], guildId),
    ]);
    return;
  }

  async disableMany(guildId: string, commands: string[]) {
    const updates = [];
    for (const command of commands) {
      updates.push(this.disableCommand(guildId, command));
    }
    await Promise.all(updates);
    return;
  }

  async enableMany(guildId: string, commands: string[]) {
    const guild = await this.guildService.findByGuildId(guildId);
    const updates = [];
    for (const command of commands) {
      const command_ = await this.getCommandByName(
        guild.commandLanguage,
        command,
      );
      if (guild.type < command_.type) continue;
      updates.push(this.updateCommand(guildId, command, { isEnabled: true }));
    }
    await Promise.all(updates);
    return;
  }

  async insertMany(docs: CommandDto[]) {
    return await this.guildCommandModel.insertMany(docs);
  }
}
