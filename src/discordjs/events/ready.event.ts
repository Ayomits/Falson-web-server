import { EventStructure } from "src/discordjs/common/structure/event.structure";
import { INestApplicationContext } from "@nestjs/common";
import { Client, Events } from "discord.js";

export class ReadyEvent extends EventStructure {
  name: string = Events.ClientReady;
  async execute(client: Client, app: INestApplicationContext) {
    
  }

}