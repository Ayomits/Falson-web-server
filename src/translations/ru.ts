import { SlashCommandBuilder } from 'discord.js';
import { PremiumEnum, SlashCommand } from 'src/api/common/types';

export const ru = [
  {
    name: `bot`,
    description: `Commands about our bot`,
    type: PremiumEnum.NoPrem,
    commandBuilder: new SlashCommandBuilder()
      .setName(`bot`)
      .setDescription(`commands about our bot`),
  },
] as SlashCommand[];
