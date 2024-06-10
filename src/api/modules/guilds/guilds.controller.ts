import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

@Controller('guilds')
export class GuildsController {

  /**
   * 
   * @param userId
   * Гильдии где пользователь админ/овнер
   * Также будет просто JSON объект с айдишником гильдии, аватаркой, кол-во участников и всё, дабы много данных не приходило на front
   */
  @UseGuards()
  @Get(":userId")
  userGuilds(@Param("userId") userId: string) {}
  
  /**
   * Эта штучка для бота, там будет гарда, чтобы токен бота принимать
   * Мало кто догадается, обратиться к этому сможет только бот
   */
  @Post()
  @UseGuards()
  create() {}

  /**
   * Допустим, чел купил подписку, улучшаем уровень
   */
  @Patch()
  @UseGuards()
  update() {}

  /**
   * Сервер решил удалить бота => удаляем все данные о сервере
   * В будущем удалим аналитику
   */
  @Delete()
  @UseGuards()
  delete() {}

}
