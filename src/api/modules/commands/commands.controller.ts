import { Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { CommandsService } from './commands.service';

@Controller('commands')
export class CommandsController {
  constructor(
    @Inject(CommandsService) private commandService: CommandsService,
  ) {}

  @Get(':language')
  getCommandsByLanguage(@Param('language') language: string) {
    return this.commandService.getCommandsByLanguage(language);
  }

  @Get(`:language/:commandName`)
  getCommandByName(
    @Param('language') language: string,
    @Param('commandName') commandName: string,
  ) {
    return this.commandService.getCommandByName(language, commandName);
  }

  @Put(`:guildId`) 
  /**
   * Та самая пиздатая фича
   * да-да
   */
  commandActions(@Param(`guildId`) guildId: string) {}
}
