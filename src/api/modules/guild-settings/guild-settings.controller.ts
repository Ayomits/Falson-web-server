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
import { TrustedRolesDto } from './dto/trustedRoles.dto';
import { GuildSettingsService } from './guild-settings.service';
import { GuildDto } from './dto/guild.dto';
import { LanguagesDto } from './dto/language.dto';

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
    return this.guildSettingsService.updateOne(guildId, {
      ...languages,
    } as unknown as Partial<GuildDto>);
  }

  @Delete(`:guildId`)
  delete(@Param(`guildId`) guildId: string) {
    return this.guildSettingsService.delete(guildId);
  }
}
