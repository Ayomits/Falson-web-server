import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import { GuildType, SlashCommand } from 'src/api/common/types';

export const en = [
  {
    name: `bot`,
    description: `Commands about our bot`,
    type: GuildType.Everyone,
    commandBuilder: new SlashCommandBuilder()
      .setName(`bot`)
      .setDescription(`commands about our bot`),
    groups: [
      {
        name: `group`,
        builder: new SlashCommandSubcommandGroupBuilder()
          .setName(`group`)
          .setDescription(`some desc`),
        subcommands: [
          {
            name: `subcommand`,
            description: `description`,
            builder: new SlashCommandSubcommandBuilder()
              .setName(`somename`)
              .setDescription(`somedescription`),
          },
        ],
      },
    ],
  },
] as SlashCommand[];
