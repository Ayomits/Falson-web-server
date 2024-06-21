import { Guilds, GuildsSchema } from 'src/api/modules/guilds-settings/guilds.schema';
import { INestApplicationContext } from '@nestjs/common';
import { Client } from 'discord.js';
import { GuildSettingsService } from 'src/api/modules/guilds-settings/guilds.service';
import { PremiumEnum } from 'src/api/common/types/base.types';
import mongoose, { Model } from 'mongoose';
import { VerificationService } from 'src/api/modules/verification/verification.service';
import { Verification, VerificationSchema } from 'src/api/modules/verification/verification.schema';

export class ReadySerivice {
  client: Client;
  app: INestApplicationContext;
  constructor(client: Client, app: INestApplicationContext) {
    this.client = client;
    this.app = app;
  }
  async collectAllGuilds() {
    const guildsService = this.app.get(GuildSettingsService);
    const verificationService = this.app.get(VerificationService);
    const [allGuidls, verifications] = await Promise.all([
      guildsService.findAll(),
      verificationService.findAll()
    ]);

    const guildsModel: Model<any> = mongoose.model<any>(
      Guilds.name.toLowerCase(),
      GuildsSchema,
    );
    const verificationModel: Model<any> = mongoose.model<any>(Verification.name, VerificationSchema)

    const guilds = this.client.guilds.cache.map((guild) => guild.id);
    const existedGuilds = allGuidls.map((guild) => guild.guildId);
    const existedVerifications = verifications.map(verification => verification.guildId)
    const newVerifications = guilds.filter(guild => !existedVerifications.includes(guild))
    const newGuilds = guilds.filter((guild) => !existedGuilds.includes(guild));
    const newGuildsDocs = newGuilds.map((guild) => {
      return new guildsModel({
        guildId: guild,
        premiumStatus: PremiumEnum.NoPrem,
      });
    });
    const newVerificationsDoc = newVerifications.map(verification => {
      return new verificationModel({
        guildId: verification
      })
    })
    return await Promise.all([
      guildsService.insertMany(newGuildsDocs),
      verificationService.insertMany(newVerificationsDoc)
    ])
  }
}
