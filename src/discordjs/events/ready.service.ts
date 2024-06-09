import { Guilds, GuildsSchema } from 'src/api/modules/guilds/guilds.schema';
import { INestApplicationContext } from '@nestjs/common';
import { Client } from 'discord.js';
import { GuildsService } from 'src/api/modules/guilds/guilds.service';
import { GuildsDocument, PremiumEnum } from 'src/api/common/types/base.types';
import mongoose, { Model } from 'mongoose';

export class ReadySerivice {
  client: Client;
  app: INestApplicationContext;
  constructor(client: Client, app: INestApplicationContext) {
    this.client = client;
    this.app = app;
  }
  async collectAllGuilds() {
    const guildsService = this.app.get(GuildsService);
    const allGuidls = await guildsService.findAll();
    const guildsModel: Model<GuildsDocument> = mongoose.model<GuildsDocument>(
      Guilds.name.toLowerCase(),
      GuildsSchema,
    );

    const guilds = this.client.guilds.cache.map((guild) => guild.id);
    const existedGuilds = allGuidls.map((guild) => guild.guildId);
    const newGuilds = guilds.filter((guild) => !existedGuilds.includes(guild));
    const newGuildsDocs = newGuilds.map((guild) => {
      return new guildsModel({
        guildId: guild,
        premiumStatus: PremiumEnum.NoPrem,
      });
    });
    return await guildsService.insertMany(newGuildsDocs);
  }
}
