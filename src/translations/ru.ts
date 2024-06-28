import { SlashCommandBuilder } from 'discord.js';
import { GuildType, SlashCommand } from 'src/api/common/types';

export const ru = [
  {
    dbName: "developer",
    name: `разработчик`,
    description: `Команды для сервера разработчиков`,
    type: `Команды для сервера разработчиков`,
    commandBuilder: new SlashCommandBuilder()
      .setName(`разработчик`)
      .setDescription(`Команды для сервера разработчиков`)
      .addSubcommand((command) =>
        command
          .setName(`разрешить`)
          .setDescription(`разрешение бага`)
          .addStringOption((option) =>
            option
              .setName(`идентификатор`)
              .setDescription(`Уникальный идентификатор бага`),
          ),
      ),
  },
  {
    dbName: "verify",
    name: `вирифицировать`,
    description: `Верификация пользователя`,
    type: GuildType.Everyone,
    commandBuilder: new SlashCommandBuilder()
      .setName(`верифицировать`)
      .setDescription(`Верификация пользователя`)
      .addUserOption((option) =>
        option
          .setName(`пользователь`)
          .setDescription(`Пользователь для верификации`),
      ),
  },
  {
    dbName: "information",
    name: `information`,
    description: `Information about our bot`,
    type: GuildType.Everyone,
    commandBuilder: new SlashCommandBuilder()
      .setName(`information`)
      .setDescription(`Information about our bot`),
  },
  {
    dbName: "guild-profile",
    name: `guild-profile`,
    description: `Information about your guild`,
    type: GuildType.Everyone,
    commandBuilder: new SlashCommandBuilder()
      .setName(`guild-profile`)
      .setDescription(`Information about your guild`),
  },
] as SlashCommand[];
