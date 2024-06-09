import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';

config();
export const client = new Client({
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3030);
}
bootstrap();

client.login(process.env.TOKEN)
