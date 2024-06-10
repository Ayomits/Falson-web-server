import { Events } from "discord.js";
import { EventStructure } from "../common/structure/event.structure";

export class GuildCreate extends EventStructure {
  name: string = Events.GuildCreate;
}