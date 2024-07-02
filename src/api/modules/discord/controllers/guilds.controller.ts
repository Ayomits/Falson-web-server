import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs/main';
import { MergedIsWhiteList } from '../../../guards';

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
  async getAllGuilds() {
    return await this.clientFetcher.fetchGuilds();
  }

  @Get(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  async getGuild(@Param(`guildId`) guildId: string) {
    return await this.clientFetcher.fetchGuild(guildId);
  }

  @Get(`:guildId/roles`)
  @UseGuards(MergedIsWhiteList)
  async getAllRoles(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchRoles(guildId);
  }

  @Get(`:guildId/roles/:roleId`)
  @UseGuards(MergedIsWhiteList)
  async getRoleById(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
  ) {
    return await this.clientFetcher.fetchRole(guildId, roleId);
  }

  @Get(`:guildId/channels`)
  @UseGuards(MergedIsWhiteList)
  async getAllChannels(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchAllGuildChannels(guildId);
  }

  @Get(`:guildId/channels/:channelId`)
  @UseGuards(MergedIsWhiteList)
  async getChannelById(
    @Param('guildId') guildId: string,
    @Param(`channelId`) channelId: string,
  ) {
    return await this.clientFetcher.fetchGuildChannel(guildId, channelId);
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
