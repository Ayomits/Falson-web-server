import { Channel, Client, Guild, GuildChannel } from 'discord.js';
import { ChannelId, GuildId, RoleId, UserId } from '../types/base.types';

export class ClientFetcher {
  public readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getAllGuildsFromCache() {
    return this.client.guilds?.cache;
  }
  getGuildFromCache(guildId: GuildId) {
    return this.client.guilds.cache.get(guildId);
  }

  getAllChannelsFromCache() {
    return this.client.channels.cache;
  }
  getChannelFromCache(channelId: ChannelId) {
    return this.client.channels.cache.get(channelId);
  }

  getUsersFromCache() {
    return this.client.users.cache;
  }
  getUserFromCache(userId: UserId) {
    return this.client.users.cache.get(userId);
  }

  getRoleFromCache(guildId: GuildId, roleId: RoleId) {
    const guild = this.getGuildFromCache(guildId);
    if (!guild) return null;
    return guild.roles.cache.get(roleId);
  }

  getMembersCount(guildId: GuildId) {
    const guild = this.getGuildFromCache(guildId);
    if (!guild) return null;
    return guild.memberCount;
  }
  getMembersFromCache(guildId: GuildId) {
    const guild = this.getGuildFromCache(guildId);
    if (!guild) return null;
    return guild.members.cache;
  }
  getMemberFromCache(guildId: GuildId, userId: UserId) {
    const guild = this.getGuildFromCache(guildId);
    if (!guild) return null;
    return guild.members.cache.get(userId);
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

  async fetchGuilds() {
    return await this.client.guilds.fetch();
  }
  async fetchGuild(guildId: GuildId) {
    return await this.client.guilds.fetch(guildId);
  }

  async fetchChannel(channelId: ChannelId) {
    return await this.client.channels.fetch(channelId);
  }
  async fetchRoles(guildId: GuildId, roleId: RoleId) {
    const guild = await this.fetchGuild(guildId);
    if (!guild) return null;
    return await guild.roles.fetch(roleId);
  }

  async fetchUser(userId: UserId) {
    return await this.client.users.fetch(userId);
  }

  async fetchMembers(guildId: GuildId) {
    const guild = await this.fetchGuild(guildId);
    if (!guild) return null;
    return await guild.members.fetch();
  }
  async fetchMember(guildId: GuildId, userId: UserId) {
    const guild = await this.fetchGuild(guildId);
    if (!guild) return null;
    return await guild.members.fetch(userId);
  }
}
