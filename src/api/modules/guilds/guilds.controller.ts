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
import { GuildsService } from './guilds.service';
import { Guilds } from './guilds.schema';
import { ExistedGuildInterceptor } from 'src/api/interceptors/existedGuild.interceptor';
import { IsBotGuard } from 'src/api/modules/guards/services/isBot.guard';
import { GuildDto, GuildUsersDto } from './dto/guilds.dto';

@Controller('guilds')
@UseInterceptors(ExistedGuildInterceptor)
export class GuildsController {
  constructor(@Inject(GuildsService) private guildService: GuildsService) {}

  /**
   * Get доступен всегда и любому
   * Это гет любой гильдии, могу кнш сделать для бота онли, но похуй
   * @param guildId
   * @returns
   */
  @Get(':guildId')
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
  @UseGuards(IsBotGuard)
  async update(@Param('guildId') guildId: string, @Body() newGuild: Guilds) {
    return await this.guildService.updateOne(guildId, newGuild);
  }

  /**
   * Права на редактирование панели
   * ТОЛЬКО ПУТ ЗАПРОСЫ И НИЧЕГО БОЛЕЕ
   * ПРОЕБАЛСЯ ФРОНТ - ИДУТ ВСЕ НАХУЙ!!
   */
  @Put(':guildId/users/set')
  /**
   *
   * Гарда isServerOwner
   */
  @UseGuards()
  async setUsers(
    @Param('guildId') guildId: string,
    @Body() users: GuildUsersDto,
  ) {
    return await this.guildService.setUsers(guildId, users.users);
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
