import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GuildSettingsService } from './guilds.service';
import { Guilds } from './guilds.schema';
import { GuildDto, GuildUsersDto } from './dto/guilds.dto';
import { IsBotGuard } from '../auth/guards/isBot.guard';
import { IsAuthGuard } from '../auth/guards/isAuth.guard';
import { MergedIsOwner } from '../auth/guards/merged/mergedIsOwner.guard';
import { MergedIsWhiteList } from '../auth/guards/merged/mergedIsWhiteList.guard';

@Controller('guilds-settings')
export class GuildsController {
  constructor(@Inject(GuildSettingsService) private guildService: GuildSettingsService) {}

  /**
   * Get доступен всегда и любому
   * Это гет любой гильдии, могу кнш сделать для бота онли, но похуй
   * @param guildId
   * @returns
   */
  @Get(':guildId')
  @UseGuards(MergedIsWhiteList)
  findGuild(@Param('guildId') guildId: string) {
    return this.guildService.findByGuildId(guildId);
  }

  /**
   * Эта штучка для бота, там будет гарда, чтобы токен бота принимать
   * Мало кто догадается, обратиться к этому сможет только бот
   */
  @Post()
  @UseGuards(IsBotGuard)
  create(@Body() guild: GuildDto) {
    return this.guildService.create(guild);
  }

  @Patch(`:guildId`)
  /**
   * Допустим, чел купил подписку, улучшаем уровень
   * Гарда - IsBotGuard
   * Это чистый апдейт всего
   * Также для баг хантеров
   */
  async update(@Param('guildId') guildId: string, @Body() newGuild: Guilds) {
    return await this.guildService.updateOne(guildId, newGuild);
  }

  /**
   * Права на редактирование панели
   * ТОЛЬКО ПУТ ЗАПРОСЫ И НИЧЕГО БОЛЕЕ
   * ПРОЕБАЛСЯ ФРОНТ - ИДУТ ВСЕ НАХУЙ!!
   */
  @Put(':guildId/panel/set')
  /**
   *
   * Гарда isServerOwner
   */
  @UseGuards(IsAuthGuard, MergedIsOwner)
  async setUsers(
    @Param('guildId') guildId: string,
    @Body() users: GuildUsersDto,
  ) {
    return this.guildService.setUsers(guildId, users.users);
  }

  @Delete(`:guildId`)
  /**
   * Как бы, лучше уж у тебя база данных будет весить на 200 kb больше, чем иметь меньше аналитики и статистики на руках
   */
  @UseGuards(IsBotGuard)
  delete(@Param('guildId') guildId: string) {
    return this.guildService.deleteOne(guildId);
  }
}
