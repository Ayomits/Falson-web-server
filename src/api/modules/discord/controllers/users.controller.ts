import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';

import { client } from 'src/discordjs/main';
import { MergedIsWhiteList } from '../../../guards';

@Controller(`discord/users`)
export class DiscordUsersController {
  clientFetcher: ClientFetcher = new ClientFetcher(client);

  @Get(`:userId`)
  async getByUserId(@Param('userId') userId: string) {
    return await this.clientFetcher.fetchUser(userId);
  }
  
}
