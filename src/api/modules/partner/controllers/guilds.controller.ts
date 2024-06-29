import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GuildPartnerDto } from '../dto/guild.dto';

@Controller(`partners/guilds`)
export class GuildPartnersController {
  @Get(`guilds`)
  getGuildsPartners() {}

  @Get(`guilds/:guildId`)
  getGuildPartners(@Param(`guildId`) guildId: string) {}

  @Post()
  createGuildPartner(@Body() dto: GuildPartnerDto) {}

  @Patch(`guilds/:guildId`)
  updateGuildPartner() {}

  @Delete(`guilds/:guildId`)
  deleteGuildPartner() {}
}
