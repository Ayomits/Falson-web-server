import { NestApplicationContext, NestFactory } from "@nestjs/core";
import { Client, GatewayIntentBits } from "discord.js";
import { AppModule } from "src/api/app.module";
import EventCollector from "./events/events.collector";

let app: any;
export const client = new Client({
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
});

export async function discordjsInitialize() {
  app = await NestFactory.create(AppModule);
  new EventCollector(client);
  await client.login(process.env.TOKEN);
}
