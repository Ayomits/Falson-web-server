import { BadRequestException, Inject, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { client } from 'src/discordjs';
import { ClientFetcher } from "../functions/clientFetcher.class";
import { GuildSettingsService } from "src/api/modules/guilds-settings/guilds.service";
import { Guilds } from "src/api/modules/guilds-settings/guilds.schema";

export class ExistedGuildMiddleware implements NestMiddleware {
  constructor(
    @Inject(GuildSettingsService) private guildService: GuildSettingsService
  ) {}
  async use(req: any, res: Response, next: (error?: Error | any) => void) {
    const clientFetcher = new ClientFetcher(client)
    const guildId = req.params.guildId || req.body.guildId;
    const guildFromCache = clientFetcher.getGuildFromCache(guildId)
    if (!guildFromCache) {
      throw new BadRequestException(`Our bot has not access to this guild`);
    }
    const guildFromDb = await this.guildService.findByGuildId(guildId) as Guilds | undefined | null
    (req as any).guild = guildFromDb
    return next()
  }
}