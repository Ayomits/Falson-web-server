import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TrustedRolesDto } from './dto/TrustedRolesDto';
import { GuildDto } from './dto/GuildDto';
import { LanguagesDto } from './dto/LanguageDto';
import { GuildSettingsService } from './GuildSettingsService';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';
import { RouteType } from 'src/api/types/RouteType';

@Controller('guild-settings')
export class GuildSettingsController {
  constructor(private guildSettingsService: GuildSettingsService) {}

  @Get(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  getGuildById(@Param(`guildId`) guildId: string) {
    return this.guildSettingsService.findByGuildId(guildId);
  }

  @Post()
  @RouteProtectLevel(RouteType.BOT_ONLY)
  create(dto: GuildDto) {
    return this.create(dto);
  }

  @Put(`:guildId`)
  @RouteProtectLevel(RouteType.OWNER_BOT)
  putTrustedRoles(
    @Param(`guildId`) guildId: string,
    @Body() dto: TrustedRolesDto,
  ) {
    return this.guildSettingsService.updateTrustedRoles(guildId, dto.roles);
  }

  @Patch(`:guildId/languages`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  patchLanguages(
    @Param(`guildId`) guildId: string,
    @Body() languages: LanguagesDto,
  ) {
    return this.guildSettingsService.updateLanguage(guildId, languages);
  }

  @Patch(`:guildId`)
  @RouteProtectLevel(RouteType.BOT_ONLY)
  updateGuild(@Param(`guildId`) guildId: string, @Body() dto: GuildDto) {
    return this.guildSettingsService.updateOne(guildId, dto);
  }

  @Delete(`:guildId`)
  @RouteProtectLevel(RouteType.BOT_ONLY)
  delete(@Param(`guildId`) guildId: string) {
    return this.guildSettingsService.delete(guildId);
  }
}
