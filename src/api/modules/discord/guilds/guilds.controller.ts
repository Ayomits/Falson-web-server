import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs/main';
import { MergedIsWhiteList } from '../../auth/guards';

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
  getAllGuilds() {
    return this.clientFetcher.getAllGuildsFromCache();
  }

  @Get(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  getGuild(@Param(`guildId`) guildId: string) {
    return this.clientFetcher.getGuildFromCache(guildId);
  }

  @Get(`:guildId/roles`)
  @UseGuards(MergedIsWhiteList)
  getAllRoles(@Param('guildId') guildId: string) {
    return this.clientFetcher.getAllRoles(guildId);
  }

  @Get(`:guildId/roles/:roleId`)
  @UseGuards(MergedIsWhiteList)
  getRoleById(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.clientFetcher.getRoleFromCache(guildId, roleId);
  }

  @Get(`:guildId/channels`)
  @UseGuards(MergedIsWhiteList)
  getAllChannels(@Param('guildId') guildId: string) {
    return this.clientFetcher.getAllChannelsGuild(guildId);
  }

  @Get(`:guildId/channels/:channelId`)
  @UseGuards(MergedIsWhiteList)
  getChannelById(
    @Param('guildId') guildId: string,
    @Param(`channelId`) channelId: string,
  ) {
    return this.clientFetcher.getGuildChannel(guildId, channelId);
  }

  @Get(`:guildId/members`)
  @UseGuards(MergedIsWhiteList)
  async allMembers(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchMembers(guildId);
  }

  @Get(`:guildId/members/:memberId`)
  @UseGuards(MergedIsWhiteList)
  async getMemberById(
    @Param('guildId') guildId: string,
    @Param(`memberId`) memberId: string,
  ) {
    return await this.clientFetcher.fetchMember(guildId, memberId);
  }
}
