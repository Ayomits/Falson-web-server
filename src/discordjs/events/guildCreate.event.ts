import { EmbedBuilder, Events, Guild, TextChannel } from 'discord.js';
import { EventStructure } from '../common/structure/event.structure';
import { INestApplicationContext } from '@nestjs/common';
import { GuildSettingsService } from 'src/api/modules/guilds-settings/guilds.service';
import { VerificationService } from 'src/api/modules/verification/verification.service';

export class GuildCreate extends EventStructure {
  name: string = Events.GuildCreate;

  async execute(guild: Guild, app: INestApplicationContext) {
    const guildService = app.get(GuildSettingsService);
    const verificationService = app.get(VerificationService);
    const channel = guild.client.channels.cache.get(
      '1176555942196817951',
    ) as TextChannel;
    const embed = new EmbedBuilder()
      .setColor(0x2c2f33)
      .setThumbnail(guild.iconURL())
      .setTitle(`Новый сервер`)
      .setFields(
        {
          name: `> Название сервера`,
          value: '```' + guild.name + '```',
        },

        {
          name: `> Количество участников`,
          value: '```' + (await guild.fetch()).memberCount + '```',
        },
        {
          name: `> Создан`,
          value: "```" + guild.createdAt + "```"
        }
      );
    return await Promise.all([
      guildService.create({ guildId: guild.id }),
      verificationService.createAllSettings(guild.id, {
        guildId: guild.id,
      }),
      await channel.send({
        embeds: [embed],
      }),
    ]);
  }
}
