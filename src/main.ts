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
  console.log(process.env.TOKEN);
  await app.listen(3000);
  client.login(process.env.TOKEN).then(() => console.log(`bot ${client.user.id}`));
}
bootstrap();
