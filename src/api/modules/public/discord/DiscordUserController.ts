import { Controller, Get, Param } from '@nestjs/common';
import { AbstractController } from 'src/api/abstractions/AbstractController';

@Controller(`discord/users`)
export class DiscordUserController extends AbstractController {
  @Get(`:userId`)
  async getByUserId(@Param('userId') userId: string) {
    return await this.clientFetcher.fetchUser(userId);
  }
}
