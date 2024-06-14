import { Events, Guild } from 'discord.js';
import { EventStructure } from '../common/structure/event.structure';
import { INestApplicationContext } from '@nestjs/common';
import { GuildsService } from 'src/api/modules/guilds/guilds.service';
import { VerificationService } from 'src/api/modules/verification/verification.service';

export class GuildCreate extends EventStructure {
  name: string = Events.GuildCreate;

  async execute(guild: Guild, app: INestApplicationContext) {
    const guildService = app.get(GuildsService);
    const verificationService = app.get(VerificationService);
    return await Promise.all([
      guildService.create({ guildId: guild.id }),
      verificationService.createAllSettings(guild.id, {
        guildId: guild.id,
      }),
    ]);
  }
}
