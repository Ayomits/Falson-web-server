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

@Controller('guilds')
@UseInterceptors(ExistedGuildInterceptor)
export class GuildsController {
  constructor(@Inject(GuildsService) private guildService: GuildsService) {}

  @Get(':guildId')
  async findGuild(@Param('guildId') guildId: string) {
    return await this.guildService.findByGuildId(guildId);
  }

  /**
   * Эта штучка для бота, там будет гарда, чтобы токен бота принимать
   * Мало кто догадается, обратиться к этому сможет только бот
   */
  @Post()
  @UseGuards(IsBotGuard)
  async create(@Body() guild: Guilds) {
    return await this.guildService.create(guild);
  }

  /**
   * Допустим, чел купил подписку, улучшаем уровень (придумай способ защиты)
   */
  @Patch(`:guildId`)
  @UseGuards(IsBotGuard)
  async update(@Param('guildId') guildId: string, @Body() newGuild: Guilds) {
    return await this.guildService.updateOne(guildId, newGuild);
  }

  @Post(':guildId')
  async pushUser(@Param('guildId') guildId: string, @Body() users: string[]) {
    return await this.guildService.pushUser(guildId, users);
  }

  /**
   * Сервер решил удалить бота => удаляем все данные о сервере
   * В будущем удалим аналитику
   */
  @Delete(`:guildId`)
  @UseGuards(IsBotGuard)
  async delete(@Param('guildId') guildId: string) {
    return await this.guildService.deleteOne(guildId);
  }
}
