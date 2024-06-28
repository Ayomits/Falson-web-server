import { SlashCommandBuilder } from 'discord.js';
import { GuildType, SlashCommand } from 'src/api/common/types';

export const en = [
  {
    dbName: `developer`,
    name: `developer`,
    description: `Commands for developer server`,
    type: `Commands for developer server`,
    commandBuilder: new SlashCommandBuilder()
      .setName(`developer`)
      .setDescription(`Commands for developer server`)
      .addSubcommand((command) =>
        command
          .setName(`resolve`)
          .setDescription(`resolve bug`)
          .addStringOption((option) =>
            option.setName(`id`).setDescription(`Unique bug id`),
          ),
      ),
  },
  {
    dbName: `verify`,
    name: `verify`,
    description: `Verify user`,
    type: GuildType.Everyone,
    commandBuilder: new SlashCommandBuilder()
      .setName(`verify`)
      .setDescription(`Verify user`)
      .addUserOption((option) =>
        option.setName(`user`).setDescription(`User for verification`),
      ),
  },
  {
    dbName: `information`,
    name: `information`,
    description: `Information about our bot`,
    type: GuildType.Everyone,
    commandBuilder: new SlashCommandBuilder()
      .setName(`information`)
      .setDescription(`Information about our bot`),
  },
  {
    dbName: `guild-profile`,
    name: `guild-profile`,
    description: `Information about your guild`,
    type: GuildType.Everyone,
    commandBuilder: new SlashCommandBuilder()
      .setName(`guild-profile`)
      .setDescription(`Information about your guild`),
  },
] as SlashCommand[];
