import { Controller, Get, Param } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs/main';
import { IsCache } from 'src/api/interceptors';

/**
 * Выдача всех данных по Djs клиенту
 * В основно сервера, каналы и роли
 */
@Controller('discord/guilds')
export class GuildsController {
  clientFetcher: ClientFetcher = new ClientFetcher(client);

  @Get(`:guildId`)
  @IsCache(false)
  async getGuild(@Param(`guildId`) guildId: string) {
    return await this.clientFetcher.fetchGuild(guildId);
  }

  @Get(`:guildId/roles`)
  @IsCache(false)
  async getAllRoles(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchRoles(guildId);
  }

  @Get(`:guildId/roles/:roleId`)
  @IsCache(false)
  async getRoleById(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
  ) {
    return await this.clientFetcher.fetchRole(guildId, roleId);
  }

  @Get(`:guildId/channels`)
  @IsCache(false)
  async getAllChannels(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchAllGuildChannels(guildId);
  }

  @Get(`:guildId/channels/:channelId`)
  @IsCache(false)
  async getChannelById(
    @Param('guildId') guildId: string,
    @Param(`channelId`) channelId: string,
  ) {
    return await this.clientFetcher.fetchGuildChannel(guildId, channelId);
  }

  @Get(`:guildId/members`)
  @IsCache(false)
  async allMembers(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchMembers(guildId);
  }

  @Get(`:guildId/members/:memberId`)
  @IsCache(false)
  async getMemberById(
    @Param('guildId') guildId: string,
    @Param(`memberId`) memberId: string,
  ) {
    return await this.clientFetcher.fetchMember(guildId, memberId);
  }
}
