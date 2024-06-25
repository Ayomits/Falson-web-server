import { SlashCommandBuilder } from 'discord.js';
import { GuildType, SlashCommand } from 'src/api/common/types';

export const ru = [
  {
    name: `bot`,
    description: `Commands about our bot`,
    type: GuildType.Everyone,
    commandBuilder: new SlashCommandBuilder()
      .setName(`bot`)
      .setDescription(`commands about our bot`),
  },
] as SlashCommand[];
