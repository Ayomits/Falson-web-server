import { Event } from "../base";
import { Client, Collection } from "discord.js";
import * as path from "path";
import kleur from "kleur";
import { rootDir } from "../constants";
import { glob } from "glob";
import { EventStructure } from "@structures/event.structure";

export default class EventCollector extends Collection<string, Event> {
  readonly client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
    this.collect();
  }

  private async collect() {
    const currentDir = path.basename(rootDir);
    const pattern = `${currentDir}/**/*.event.{js,ts}`;
    const files = await glob(pattern);
    await Promise.all([
      files.map(async (file) => {
        const eventClass = await import(
          path.relative(__dirname, file).slice(0, -3)
        );
        Object.values(eventClass).forEach(async (event: any) => {
          if (
            typeof event === "function" &&
            event.prototype instanceof EventStructure
          ) {
            const eventInstance = new event();
            if (eventInstance.once) {
              this.client.once(
                eventInstance.name,
                async (...args) => await eventInstance.execute(...args)
              );
            }else {
              this.client.on(
                eventInstance.name,
                async (...args) => await eventInstance.execute(...args)
              );
            }
            const date = new Date();
            console.log(
              kleur.green(`[${process.env.INSCRIPTION}] -`),
              kleur.yellow(
                `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
              ),
              kleur.green(`-`),
              kleur.green(`[${eventInstance.name.toUpperCase()}]`),
              `успешно отработал (once: ${eventInstance.once})`
            );
          }
        });
      }),
    ]);
  }
}