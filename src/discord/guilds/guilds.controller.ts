import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ClientFetcher } from 'src/api/common/functions/clientFetcher.class';
import { IsBotGuard } from 'src/api/modules/auth/guards/isBot.guard';
import { MergedIsWhiteList } from 'src/api/modules/auth/guards/merged/mergedIsWhiteList.guard';
import { client } from 'src/discordjs';

@Controller('discord/guilds')
export class GuildsController {
  clientFetcher: ClientFetcher = new ClientFetcher(client);

  @Get(`/`)
  @UseGuards(IsBotGuard)
  getAllGuilds() {
    return this.clientFetcher.getAllGuildsFromCache()
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
  allMembers(@Param('guildId') guildId: string) {
    return this.clientFetcher.getMembersFromCache(guildId);
  }

  @Get(`:guildId/members/:memberId`)
  @UseGuards(MergedIsWhiteList)
  getMemberById(
    @Param('guildId') guildId: string,
    @Param(`memberId`) memberId: string,
  ) {
    return this.clientFetcher.getMemberFromCache(guildId, memberId);
  }
}
