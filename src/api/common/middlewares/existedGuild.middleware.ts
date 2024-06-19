import { BadRequestException, Inject, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { client } from 'src/discordjs';
import { ClientFetcher } from "../functions/clientFetcher.class";
import { GuildsService } from "src/api/modules/guilds/guilds.service";
import { Guilds } from "src/api/modules/guilds/guilds.schema";

export class ExistedGuildMiddleware implements NestMiddleware {
  constructor(
    @Inject(GuildsService) private guildService: GuildsService
  ) {}
  async use(req: Request, res: Response, next: (error?: Error | any) => void) {
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