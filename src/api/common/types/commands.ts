import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';


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

};

export type GuildCommandType = {
  roles: string[];
  channels: string[];
  isEnabled: boolean;
};
