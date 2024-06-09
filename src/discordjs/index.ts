import { NestFactory } from '@nestjs/core';
import { Client, GatewayIntentBits } from 'discord.js';
import { AppModule } from 'src/api/app.module';
import EventCollector from './events/events.collector';

export const client = new Client({
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
});
export async function getApp() {
  return await NestFactory.createApplicationContext(AppModule);
}

export async function discordjsInitialize() {
  new EventCollector(client);
  await client.login(process.env.TOKEN);
}
