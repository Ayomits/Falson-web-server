import { Client, Guild } from 'discord.js';
import { client } from '../main';

export class ClientFetcher {
  private readonly client: Client;
  constructor() {
    this.client = client;
  }

  getAllGuildsFromCache() {
    return this.client.guilds.cache;
  }
  getGuildFromCache(guildId: string) {
    return this.client.guilds.cache.get(guildId);
  }

  getAllChannelsFromCache() {
    return this.client.channels.cache;
  }
  getChannelFromCache(channelId: string) {
    return this.client.channels.cache.get(channelId);
  }

  getUsersFromCache() {
    return this.client.users.cache;
  }
  getUserFromCache(userId: string) {
    return this.client.users.cache.get(userId);
  }

  getRoleFromCache(guildId: string, roleId: string) {
    const guild = this.getGuildFromCache(guildId);
    if (!guild) return null;
    return guild.roles.cache.get(roleId);
  }

  getMembersCount(guildId: string) {
    const guild = this.getGuildFromCache(guildId);
    if (!guild) return null;
    return guild.memberCount;
  }
  getMembersFromCache(guildId: string) {
    const guild = this.getGuildFromCache(guildId);
    if (!guild) return null;
    return guild.members.cache;
  }
  getMemberFromCache(guildId: string, userId: string) {
    const guild = this.getGuildFromCache(guildId);
    if (!guild) return null;
    return guild.members.cache.get(userId);
  }

  /**
   *
   * @param {string} userId
   * Метод предназначен для поиска гильдий, где пользователь админ/овнер
   */
  getAdminsGuild(userId: string) {
    const guilds = this.getAllGuildsFromCache();
    guilds.filter((guild) => {
      const member = this.getMemberFromCache(guild.id, userId);
      if (!member) {
        return false;
      }
      if (!member.permissions.has(8n) || guild.ownerId !== member.id) {
        return false;
      }
    });

    return guilds;
  }

  async fetchGuilds() {
    return await this.client.guilds.fetch();
  }
  async fetchGuild(guildId: string) {
    return await this.client.guilds.fetch(guildId);
  }

  async fetchChannel(channelId: string) {
    return await this.client.channels.fetch(channelId);
  }
  async fetchRoles(guildId: string, roleId: string) {
    const guild = await this.fetchGuild(guildId);
    if (!guild) return null;
    return await guild.roles.fetch(roleId);
  }

  async fetchUser(userId: string) {
    return await this.client.users.fetch(userId);
  }

  async fetchMembers(guildId: string) {
    const guild = await this.fetchGuild(guildId);
    if (!guild) return null;
    return await guild.members.fetch();
  }
  async fetchMember(guildId: string, userId: string) {
    const guild = await this.fetchGuild(guildId);
    if (!guild) return null;
    return await guild.members.fetch(userId);
  }
}

export const ClientFetcherInstance = new ClientFetcher();
