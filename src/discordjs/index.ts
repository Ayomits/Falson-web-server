import { NestFactory } from '@nestjs/core';
import { Client, GatewayIntentBits, Options } from 'discord.js';
import { AppModule } from 'src/api/app.module';
import EventCollector from './events/events.collector';

const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers];

export const client: Client = new Client({
  intents: intents,
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    ReactionManager: 0,
    MessageManager: 0,
    DMMessageManager: 0,
    GuildInviteManager: 0,
    GuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildMessageManager: 0,
    GuildTextThreadManager: 0,
    GuildScheduledEventManager: 0,
  }),
  
});
export async function getApp() {
  return await NestFactory.createApplicationContext(AppModule);
}

export async function discordjsInitialize() {
  new EventCollector(client);
  await client.login(process.env.TOKEN).then(() => console.log(`Бот запущен`));
}
