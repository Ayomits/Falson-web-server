import { Client, Guild } from 'discord.js';

export class ClientFetcher {
  private readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getAllGuildsFromCache() {
    return this.client.guilds?.cache;
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
  getAdminsGuild(guilds: Guild[], userId: string) {
    const sortedGuild = guilds
      .filter((guild) => guild.members.cache.has(userId))
      .map((guild) => {
        const member = guild.members.cache.get(userId);
        if (member.permissions.has(8n) || member.id === guild.ownerId) {
          return guild;
        }
      });
    return sortedGuild
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
