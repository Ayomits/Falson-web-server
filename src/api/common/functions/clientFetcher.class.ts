import { Client, Guild, GuildChannel } from 'discord.js';
import { ChannelId, GuildId, RoleId, UserId } from '../types/base.types';

export class ClientFetcher {
  public readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  // Guild related methods
  getAllGuildsFromCache() {
    return this.client.guilds?.cache;
  }

  getGuildFromCache(guildId: GuildId) {
    return this.client.guilds.cache.get(guildId);
  }

  async fetchGuilds() {
    return await this.client.guilds.fetch();
  }

  async fetchGuild(guildId: GuildId) {
    return await this.client.guilds.fetch(guildId);
  }

  getMembersCount(guildId: GuildId) {
    const guild = this.getGuildFromCache(guildId);
    return guild ? guild.memberCount : null;
  }

  // Channel related methods
  getAllChannelsFromCache() {
    return this.client.channels.cache;
  }

  getChannelFromCache(channelId: ChannelId) {
    return this.client.channels.cache.get(channelId);
  }

  getGuildChannel(guildId: GuildId, channelId: ChannelId) {
    const guild = this.getGuildFromCache(guildId);
    return guild ? guild.channels.cache.get(channelId) : null;
  }

  getAllChannelsGuild(guildId: GuildId) {
    const guild = this.getGuildFromCache(guildId);
    return guild ? guild.channels.cache : null;
  }

  async fetchChannel(channelId: ChannelId) {
    return await this.client.channels.fetch(channelId);
  }

  // User related methods
  getUsersFromCache() {
    return this.client.users.cache;
  }

  getUserFromCache(userId: UserId) {
    return this.client.users.cache.get(userId);
  }

  async fetchUser(userId: UserId) {
    return await this.client.users.fetch(userId);
  }

  // Member related methods
  getMembersFromCache(guildId: GuildId) {
    const guild = this.getGuildFromCache(guildId);
    return guild ? guild.members.cache : null;
  }

  getMemberFromCache(guildId: GuildId, userId: UserId) {
    const guild = this.getGuildFromCache(guildId);
    return guild ? guild.members.cache.get(userId) : null;
  }

  async fetchMembers(guildId: GuildId) {
    const guild = await this.fetchGuild(guildId);
    return guild ? await guild.members.fetch() : null;
  }

  async fetchMember(guildId: GuildId, userId: UserId) {
    const guild = await this.fetchGuild(guildId);
    return guild ? await guild.members.fetch(userId) : null;
  }

  // Role related methods
  getAllRoles(guildId: GuildId) {
    const guild = this.getGuildFromCache(guildId);
    return guild ? guild.roles.cache : null;
  }

  getRoleFromCache(guildId: GuildId, roleId: RoleId) {
    const guild = this.getGuildFromCache(guildId);
    return guild ? guild.roles.cache.get(roleId) : null;
  }

  async fetchRoles(guildId: GuildId, roleId: RoleId) {
    const guild = await this.fetchGuild(guildId);
    return guild ? await guild.roles.fetch(roleId) : null;
  }

  /**
   *
   * @param {string} userId
   * Метод предназначен для поиска гильдий, где пользователь админ/овнер
   */
  getAdminsGuild(guilds: Guild[], userId: UserId) {
    const sortedGuild = guilds
      .filter((guild) => guild.members.cache.has(userId))
      .map((guild) => {
        const member = guild.members.cache.get(userId);
        if (member.permissions.has(8n) || member.id === guild.ownerId) {
          return guild;
        }
      });
    return sortedGuild;
  }

}
