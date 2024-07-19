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
import { TrustedRolesDto } from './dto/TrustedRolesDto';
import { GuildDto } from './dto/GuildDto';
import { LanguagesDto } from './dto/LanguageDto';
import { GuildSettingsService } from './GuildSettingsService';

@Controller('guild-settings')
export class GuildSettingsController {
  constructor(private guildSettingsService: GuildSettingsService) {}

  @Get(`:guildId`)

  getGuildById(@Param(`guildId`) guildId: string) {
    return this.guildSettingsService.findByGuildId(guildId);
  }

  @Post()
  create(dto: GuildDto) {
    return this.create(dto);
  }

  @Put(`:guildId`)
  putTrustedRoles(
    @Param(`guildId`) guildId: string,
    @Body() dto: TrustedRolesDto,
  ) {
    return this.guildSettingsService.updateTrustedRoles(guildId, dto.roles);
  }

  @Patch(`:guildId/languages`)
  patchLanguages(
    @Param(`guildId`) guildId: string,
    @Body() languages: LanguagesDto,
  ) {
    return this.guildSettingsService.updateLanguage(guildId, languages);
  }

  @Patch(`:guildId`)
  updateGuild(@Param(`guildId`) guildId: string, @Body() dto: GuildDto) {
    return this.guildSettingsService.updateOne(guildId, dto);
  }

  @Delete(`:guildId`)
  delete(@Param(`guildId`) guildId: string) {
    return this.guildSettingsService.delete(guildId);
  }
}
