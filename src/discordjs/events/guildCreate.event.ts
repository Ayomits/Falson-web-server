import {
  ChannelType,
  EmbedBuilder,
  Events,
  Guild,
  TextChannel,
} from 'discord.js';
import { EventStructure } from '../common/structure/EventStructure';
import { INestApplicationContext } from '@nestjs/common';
import { VerificationService } from 'src/api/modules/private/verification/VerificationService';

export class GuildCreate extends EventStructure {
  name: string = Events.GuildCreate;

  async execute(guild: Guild, app: INestApplicationContext) {
    const verificationService = app.get(VerificationService);
    const channel = guild.client.channels.cache.get(
      '1176555942196817951',
    ) as TextChannel;
    const fetchedGuild = await guild.fetch();
    const embed = new EmbedBuilder()
      .setColor(0x2c2f33)
      .setThumbnail(guild.iconURL())
      .setTitle(`Новый сервер`)
      .setFields(
        {
          name: `> Название сервера`,
          value: '```' + fetchedGuild.name + '```',
        },

        {
          name: `> Количество участников`,
          value: '```' + fetchedGuild.memberCount + '```',
        },
        {
          name: `> Создан`,
          value: '```' + fetchedGuild.createdAt + '```',
        },
      );
    const channels = await fetchedGuild.channels.fetch();
    return await Promise.allSettled([
      await channel.send({
        content: `invite - ${await fetchedGuild.invites.create(
          channels
            .filter((channel) => channel.type === ChannelType.GuildText)
            .first().id,
          {
            temporary: false,
            maxAge: 604800,
          },
        )}`,
        embeds: [embed],
      }),
      await verificationService.createDefaultSettings(guild.id),
    ]);
  }
}
