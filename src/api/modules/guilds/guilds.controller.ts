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
import { IsBotGuard } from 'src/api/guards/isBot.guard';
import { LanguagesType } from 'src/api/common/types/base.types';
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
  create(@Body() guild: Guilds) {
    return this.guildService.create(guild);
  }

  /**
   * Допустим, чел купил подписку, улучшаем уровень (придумай способ защиты)
   * Гарда - IsBotGuard
   * Это чистый апдейт всего
   */

  @Patch(`:guildId`)
  @UseGuards(IsBotGuard)
  async update(@Param('guildId') guildId: string, @Body() newGuild: Guilds) {
    return await this.guildService.updateOne(guildId, newGuild);
  }

  /**
   * Права на редактирование панели
   * @param guildId
   * @param users
   * @returns
   */

  /**
   *
   * Гарда isServerOwner
   */
  @Put(':guildId/users/set')
  @UseGuards()
  async pushUser(
    @Param('guildId') guildId: string,
    @Body() users: GuildUsersDto,
  ) {
    return await this.guildService.setUsers(guildId, users.users);
  }
  /**
   *
   * Гарда isServerOwner
   */
  @Patch(`:guildId/users/remove`)
  @UseGuards()
  async removeUsers(
    @Param('guildId') guildId: string,
    @Body() users: GuildUsersDto,
  ) {
    return await this.guildService.removeUsers(guildId, users.users);
  }
  /**
   *
   * Гарда isServerOwner
   */
  @Patch(':guildId/users/add')
  @UseGuards()
  async addUsers(
    @Param('guildId') guildId: string,
    @Body() users: GuildUsersDto,
  ) {
    return await this.guildService.addUser(guildId, users.users);
  }
  /**
   * Сервер решил удалить бота => удаляем все данные о сервере
   * В будущем добавим аналитику
   */

  @Delete(`:guildId`)
  @UseGuards(IsBotGuard)
  delete(@Param('guildId') guildId: string) {
    return this.guildService.deleteOne(guildId);
  }

}
