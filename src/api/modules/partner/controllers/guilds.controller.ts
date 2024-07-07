import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GuildPartnerDto } from '../dto/guild.dto';
import {
  UserTypeDecorator,
  UserTypeGuard,
} from 'src/api/guards/UserType.guard';
import { UserType } from 'src/api/common/types/user';
import { GuildPartnerService } from '../services/guilds.service';
import { MergedUserTypeGuard } from 'src/api/guards/merged/mergedUserType.guard';

@Controller(`partners/guilds`)
export class GuildPartnersController {
  constructor(private guildPartnerService: GuildPartnerService) {}

  @Get(`guilds`)
  getGuildsPartners() {
    return this.guildPartnerService.findAll();
  }

  @Get(`guilds/:guildId`)
  getGuildPartners(@Param(`guildId`) guildId: string) {
    return this.guildPartnerService.findByGuildId(guildId);
  }

  @Post()
  @UserTypeDecorator(UserType.developer)
  @UseGuards(MergedUserTypeGuard)
  createGuildPartner(@Body() dto: GuildPartnerDto) {
    return this.guildPartnerService.create(dto);
  }

  @Patch(`guilds/:guildId`)
  @UserTypeDecorator(UserType.developer)
  @UseGuards(MergedUserTypeGuard)
  updateGuildPartner(
    @Param(`guildId`) guildId: string,
    @Body() dto: GuildPartnerDto,
  ) {
    return this.guildPartnerService.update(guildId, dto);
  }

  @Delete(`guilds/:guildId`)
  @UserTypeDecorator(UserType.developer)
  @UseGuards(MergedUserTypeGuard)
  deleteGuildPartner(@Param(`guildId`) guildId: string) {
    return this.guildPartnerService.delete(guildId);
  }
}
