import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

export type SubCommandType = {
  name: string;
  description: string;
  builder: SlashCommandSubcommandBuilder;
  type: number;
};

export type SubCommandGroupType = {
  name: string
  builder: SlashCommandSubcommandGroupBuilder;
  subcommands: SubCommandType[];
  /**
   * Тип для группы
   */
  type: number;
};

export type SlashCommand = {
  /**
   * Основной билдер из которого собирается команда
   */
  name: string;
  description: string;
  commandBuilder: SlashCommandBuilder;
  /**
   * Для всех, Подписчик 1 лвла, Подписчик 2 лвла, Подписчик 3 лвла
   */
  type: number;

  groups?: SubCommandGroupType[];
  subcommands?: SubCommandType[];
};
