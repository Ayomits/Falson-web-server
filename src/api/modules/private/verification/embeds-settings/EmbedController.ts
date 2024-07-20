import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { EmbedService } from './EmbedService';
import { EmbedDto } from './EmbedDto';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';
import { RouteType } from 'src/api/types/RouteType';
/**
 * Бля, раньше я считал, что эта идея хуйня будет распиливать
 * Щас понимаю насколько бекенд стал проще и легче для фронтендера
 * Просто до безумства легче
 *
 *
 *
 * ГЛОБАЛЬНАЯ ОСОБАЯ ГАРДА
 * Т.К. ТУТ ОСОБЫЕ ПРАВА И ОСОБЫЙ ДОСТУП
 */
@Controller(`verifications/embeds`)
export class EmbedsController {
  constructor(private embedService: EmbedService) {}

  @Get(`:guildId/all`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  allEmbeds(@Param(`guildId`) guildId: string) {
    return this.embedService.findByGuildId(guildId);
  }

  @Get(`:guildId/:objectId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  findCurrentEmbed(
    @Param(`guildId`) guildId: string,
    @Param(`objectId`) objectId: Types.ObjectId,
  ) {
    return this.embedService.findByIdAndGuildId(guildId, objectId);
  }

  @Post(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  createEmbed(@Param(`guildId`) guildId: string, @Body() dto: EmbedDto) {
    return this.embedService.create(guildId, dto);
  }

  @Patch(`:guildId/:objectId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  updateEmbed(
    @Param(`guildId`) guildId: string,
    @Param(`objectId`) objectId: any,
    @Body() dto: EmbedDto,
  ) {
    return this.embedService.update(guildId, objectId, dto);
  }

  @Delete(`:guildId/:objectId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  deleteEmbed(
    @Param(`guildId`) guildId: string,
    @Param(`objectId`) objectId: any,
  ) {
    return this.embedService.delete(guildId, objectId);
  }
}
