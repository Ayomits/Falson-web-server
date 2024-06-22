import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { IsBotGuard } from 'src/api/modules/auth/guards/isBot.guard';
import { client } from 'src/discordjs';

@Controller(`discord/users`)
export class DiscordUsersController {
  clientFetcher: ClientFetcher = new ClientFetcher(client);

  @Get(`:userId`)
  getByUserId(@Param('userId') userId: string) {
    return this.clientFetcher.getUserFromCache(userId);
  }

  @Get(`/`)
  @UseGuards(IsBotGuard)
  userId() {
    return this.clientFetcher.getUsersFromCache();
  }
}
