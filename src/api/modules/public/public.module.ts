import { Module } from '@nestjs/common';
import { StatsModule } from './stats/StatsModule';
import { DiscordModule } from './discord/DiscordModule';

@Module({
  imports: [StatsModule, DiscordModule],
})
export class PublicModule {}
