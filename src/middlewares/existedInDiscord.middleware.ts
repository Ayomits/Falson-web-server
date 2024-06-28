import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { ClientFetcher } from '../api/common/functions/clientFetcher.class';
import { client } from 'src/discordjs/main';

export class ExistedInDiscordMiddleware implements NestMiddleware {
  clientFetcher: ClientFetcher = new ClientFetcher(client);

  async use(req: any, res: any, next: () => void) {
    const guildId = req.params.guildId || req.body.guildId;
    const roleId = req.params.roleId || req.body.roleId;
    const channelId = req.params.channelId || req.body.channelId;
    const [guild, role, channel] = await Promise.all([
      this.clientFetcher.getGuildFromCache(guildId),
      this.clientFetcher.getRoleFromCache(guildId, roleId),
      this.clientFetcher.getChannelFromCache(channelId),
    ]);
    const [guildFlag, roleFlag, channelFlag] = [
      guildId && guild,
      roleId && guildId && guild && role,
      channelId && channel,
    ];
    if (guildId && !guildFlag)
      throw new BadRequestException(`This guild doesn't exists in our bot`);
    if (roleId && !roleFlag)
      throw new BadRequestException(`This role doesn't exists in our bot`);
    if (channelId && !channelFlag)
      throw new BadRequestException(`This channel doesn't exists in our bot`);

    return next();
  }
}
