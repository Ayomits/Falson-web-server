import { Controller, Get, Param } from '@nestjs/common';
import { AbstractController } from 'src/api/abstractions/AbstractController';
import { client } from 'src/discordjs/main';

/**
 * Выдача всех данных по Djs клиенту
 * В основно сервера, каналы и роли
 */
@Controller('discord/guilds')
export class DiscordGuildController extends AbstractController {
  @Get(`:guildId`)
  async getGuild(@Param(`guildId`) guildId: string) {
    return await this.clientFetcher.fetchGuild(guildId);
  }

  @Get(`:guildId/roles`)
  async getAllRoles(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchRoles(guildId);
  }

  @Get(`:guildId/roles/:roleId`)
  async getRoleById(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
  ) {
    return await this.clientFetcher.fetchRole(guildId, roleId);
  }

  @Get(`:guildId/channels`)
  async getAllChannels(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchAllGuildChannels(guildId);
  }

  @Get(`:guildId/channels/:channelId`)
  async getChannelById(
    @Param('guildId') guildId: string,
    @Param(`channelId`) channelId: string,
  ) {
    return await this.clientFetcher.fetchGuildChannel(guildId, channelId);
  }

  @Get(`:guildId/members`)
  async allMembers(@Param('guildId') guildId: string) {
    return await this.clientFetcher.fetchMembers(guildId);
  }

  @Get(`:guildId/members/:memberId`)
  async getMemberById(
    @Param('guildId') guildId: string,
    @Param(`memberId`) memberId: string,
  ) {
    return await this.clientFetcher.fetchMember(guildId, memberId);
  }
}
