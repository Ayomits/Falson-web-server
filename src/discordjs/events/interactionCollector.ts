import { INestApplicationContext } from '@nestjs/common';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import {
  Argument,
  ArgumentType,
  Command,
  CommandsTranslationType,
  LanguagesType,
} from 'src/api/common/types';
import { en, ru } from 'src/translations';

export type SlashComandType = {
  commandBuilder: SlashCommandBuilder;
  type: number;
  language: LanguagesType;
  subCommands: {
    builder: SlashCommandSubcommandBuilder;
    type: number;
    isContinue: boolean;
  }[];
};

export function collectCommands() {
  const commands = {
    Russian: ru,
    English: en,
  };
  const allCommands: SlashComandType[] = [];
  const buildArgument = (option: any, arg: Argument) => {
    option
      .setName(arg.name.toLowerCase())
      .setDescription(arg.description)
      .setRequired(arg.required);

    if (arg.maxLength) option.setMaxLength(arg.maxLength);
    if (arg.minLength) option.setMinLength(arg.minLength);
    return option;
  };

  const handleArguments = (
    args: { [key: string]: Argument },
    slashCommand: any,
  ) => {
    Object.values(args).forEach((arg) => {
      switch (arg.type) {
        case ArgumentType.String:
          slashCommand.addStringOption((option) => buildArgument(option, arg));
          break;
        case ArgumentType.Number:
          slashCommand.addNumberOption((option) => buildArgument(option, arg));
          break;
        case ArgumentType.Channel:
          slashCommand.addChannelOption((option) => buildArgument(option, arg));
          break;
        case ArgumentType.Role:
          slashCommand.addRoleOption((option) => buildArgument(option, arg));
          break;
        case ArgumentType.User:
          slashCommand.addUserOption((option) => buildArgument(option, arg));
          break;
      }
    });
  };

  const handleSubcommands = (subcommands: { [key: string]: Command }) => {
    const subcommandsArr = [];

    const subcommandsHandlerFunct = (subcommands: {
      [key: string]: Command;
    }) => {
      Object.values(subcommands).forEach((subCommand) => {
        const hasSubcommands = !!subCommand.subcommands;
        const subCommandBuilder = hasSubcommands
          ? new SlashCommandSubcommandGroupBuilder()
              .setName(subCommand.name)
              .setDescription(subCommand.description)
          : new SlashCommandSubcommandBuilder()
              .setName(subCommand.name)
              .setDescription(subCommand.description);

        if (subCommand.args && !hasSubcommands) {
          handleArguments(subCommand.args, subCommandBuilder);
        }
        subcommandsArr.push({
          builder: subCommandBuilder,
          type: subCommand.type,
          isContinue: hasSubcommands,
        });

        if (hasSubcommands) {
          subcommandsHandlerFunct(subCommand.subcommands);
        }
      });
    };

    subcommandsHandlerFunct(subcommands);
    return subcommandsArr;
  };

  Object.keys(commands).forEach((languageKey) => {
    const commandLocalization = commands[
      languageKey
    ] as CommandsTranslationType;

    Object.keys(commandLocalization).forEach((commandKey) => {
      const commandData = commandLocalization[commandKey] as Command;
      const slashCommand = new SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description);

      let subCommands: any[] = [];
      if (commandData.args) handleArguments(commandData.args, slashCommand);
      if (commandData.subcommands) {
        subCommands = handleSubcommands(commandData.subcommands);
      }
      allCommands.push({
        commandBuilder: slashCommand,
        type: commandData.type,
        language: languageKey as LanguagesType,
        subCommands: subCommands,
      });
    });
  });
  return allCommands;
}
