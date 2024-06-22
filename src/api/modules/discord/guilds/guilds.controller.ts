import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { IsAuthGuard } from 'src/api/modules/auth/guards/isAuth.guard';
import { IsBotGuard } from 'src/api/modules/auth/guards/isBot.guard';
import { MergedIsWhiteList } from 'src/api/modules/auth/guards/merged/mergedIsWhiteList.guard';
import { client } from 'src/discordjs';

/**
 * Выдача всех данных по Djs клиенту
 * В основно сервера, каналы и роли
 */
@Controller('discord/guilds')
export class GuildsController {
  clientFetcher: ClientFetcher = new ClientFetcher(client);

  @Get(`/`)
  /**
   * Выдача всех серверов из кеша discord.js клиента
   */
  @UseGuards(IsBotGuard)
  getAllGuilds() {
    return this.clientFetcher.getAllGuildsFromCache();
  }

  @Get(`:guildId`)
  @UseGuards(IsAuthGuard, MergedIsWhiteList)
  getGuild(@Param(`guildId`) guildId: string) {
    return this.clientFetcher.getGuildFromCache(guildId);
  }

  @Get(`:guildId/roles`)
  @UseGuards(IsAuthGuard, MergedIsWhiteList)
  getAllRoles(@Param('guildId') guildId: string) {
    return this.clientFetcher.getAllRoles(guildId);
  }

  @Get(`:guildId/roles/:roleId`)
  @UseGuards(IsAuthGuard, MergedIsWhiteList)
  getRoleById(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.clientFetcher.getRoleFromCache(guildId, roleId);
  }

  @Get(`:guildId/channels`)
  @UseGuards(IsAuthGuard, MergedIsWhiteList)
  getAllChannels(@Param('guildId') guildId: string) {
    return this.clientFetcher.getAllChannelsGuild(guildId);
  }

  @Get(`:guildId/channels/:channelId`)
  @UseGuards(IsAuthGuard, MergedIsWhiteList)
  getChannelById(
    @Param('guildId') guildId: string,
    @Param(`channelId`) channelId: string,
  ) {
    return this.clientFetcher.getGuildChannel(guildId, channelId);
  }

  @Get(`:guildId/members`)
  @UseGuards(IsAuthGuard, MergedIsWhiteList)
  async allMembers(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchMembers(guildId);
  }

  @Get(`:guildId/members/:memberId`)
  @UseGuards(IsAuthGuard, MergedIsWhiteList)
  async getMemberById(
    @Param('guildId') guildId: string,
    @Param(`memberId`) memberId: string,
  ) {
    return await this.clientFetcher.fetchMember(guildId, memberId);
  }
}
