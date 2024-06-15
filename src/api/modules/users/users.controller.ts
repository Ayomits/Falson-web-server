import { Controller, Get, Inject, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs';
import { UserGuild } from 'src/api/common/types/base.types';

@Controller('users')
export class UsersController {
  clientFetcher = new ClientFetcher(client)
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  @Get(":userId/data")
  async findUserDate(@Param("userId") userId: string) {
    return await this.usersService.findUserData(userId)
  }

  @Get(":userId/guilds")
  async ownersGuild(@Param("userId") userId: string) {
    return await this.usersService.ownersAndAdminsGuild(userId)
  }

  @Get(`:userId/allguilds`)
  async allGuilds(@Param("userId") userId: string) {
    return await this.usersService.findUserGuilds(userId)
  }
}
