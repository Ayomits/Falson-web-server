import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TrustedRolesDto } from './dto/trustedRoles.dto';
import { GuildSettingsService } from './guild-settings.service';
import { GuildDto } from './dto/guild.dto';
import { LanguagesDto } from './dto/language.dto';
import { MergedIsOwner, MergedIsWhiteList } from '../auth/guards';
import { IsBotGuard } from '../auth/guards/isBot.guard';

@Controller('guild-settings')
export class GuildSettingsController {
  constructor(private guildSettingsService: GuildSettingsService) {}

  @Get(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  getGuildById(@Param(`guildId`) guildId: string) {
    return this.guildSettingsService.findByGuildId(guildId);
  }

  @Post()
  @UseGuards(IsBotGuard)
  create(dto: GuildDto) {
    return this.create(dto);
  }

  @Put(`:guildId`)
  @UseGuards(MergedIsOwner)
  putTrustedRoles(
    @Param(`guildId`) guildId: string,
    @Body() dto: TrustedRolesDto,
  ) {
    return this.guildSettingsService.updateTrustedRoles(guildId, dto.roles);
  }

  @Patch(`:guildId/languages`)
  @UseGuards(MergedIsWhiteList)
  patchLanguages(
    @Param(`guildId`) guildId: string,
    @Body() languages: LanguagesDto,
  ) {
    return this.guildSettingsService.updateOne(guildId, {
      ...languages,
    } as unknown as Partial<GuildDto>);
  }

  @Delete(`:guildId`)
  @UseGuards(IsBotGuard)
  delete(@Param(`guildId`) guildId: string) {
    return this.guildSettingsService.delete(guildId);
  }
}
