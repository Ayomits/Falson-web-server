// src/api/utils/dto/Excluder.ts
import { ClientFetcher } from '../djs/ClientFetcher';
import { client } from 'src/discordjs';

export class ExcluderUtil {
  clientFetcher = new ClientFetcher(client);

  excludeInvalidRoles(guildId: string, roles: string[]) {
    return roles.filter((role) =>
      this.clientFetcher.getRoleFromCache(guildId, role),
    );
  }
  excludeInvalidChannels(guildId: string, channels: string[]) {
    return channels.filter((channel) =>
      this.clientFetcher.getGuildChannel(guildId, channel),
    );
  }
  excludeInvalidMembers(guildId: string, members: string[]) {
    return members.filter((member) =>
      this.clientFetcher.getMemberFromCache(guildId, member),
    );
  }
  excludeInvalidUsers(users: string[]) {
    return users.filter((user) => this.clientFetcher.getUserFromCache(user));
  }
}

export const Excluder = new ExcluderUtil();
