import {
  AutocompleteInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

/**
 * Этот класс нужен тупо для типов
 */
export class SlashCommandStructure {}

/**
 * Для работы с свойствами
 */
export interface ISlashCommandStructure {
  readonly data: SlashCommandBuilder;
  execute(interaction: CommandInteraction): any;
  autoComplete?(interaction: AutocompleteInteraction | any): any;
}