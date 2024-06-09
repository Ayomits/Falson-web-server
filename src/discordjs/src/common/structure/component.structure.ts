import {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

/**
 * Для того чтобы работать с свойствами
 */
export interface IComponentStructure {
  readonly customId;
  execute(
    interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | StringSelectMenuInteraction
      | RoleSelectMenuInteraction
      | ChannelSelectMenuInteraction
  ): any;
}
/**
 * Для типа
 */
export class ComponentStructure {}
