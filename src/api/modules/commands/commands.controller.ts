import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandDto, CommandsDisableDto, CommandsEnableDto } from './dto';
import { MergedIsWhiteList } from '../../guards';
import { IsBotGuard } from '../../guards/isBot.guard';

@Controller('commands')
export class CommandsController {
  constructor(
    @Inject(CommandsService) private commandService: CommandsService,
  ) {}

  @Get('documentation/:language')
  async getCommandsByLanguage(@Param('language') language: string) {
    return await this.commandService.getCommandsByLanguage(language);
  }

  @Get(`documentation/:language/:commandName`)
  async getCommandByName(
    @Param('language') language: string,
    @Param('commandName') commandName: string,
  ) {
    return await this.commandService.getCommandByName(language, commandName);
  }

  @Get(`guilds/:guildId`)
  @UseGuards(MergedIsWhiteList)
  async getGuildCommands(@Param(`guildId`) guildId: string) {
    return await this.commandService.allCommands(guildId);
  }

  @Get(`guilds/:guildId/:commandName`)
  @UseGuards(MergedIsWhiteList)
  async getGuildCommand(
    @Param(`guildId`) guildId: string,
    @Param(`commandName`) commandName: string,
  ) {
    return await this.commandService.getCommandSettings(guildId, commandName);
  }

  @Post(`guilds`)
  @UseGuards(IsBotGuard)
  async createCommand(@Body() command: CommandDto) {
    return await this.commandService.create(command);
  }

  @Patch(`guilds/:guildId/:commandName`)
  @UseGuards(MergedIsWhiteList)
  async updateGuildCommand(
    @Param(`guildId`) guildId: string,
    @Param(`commandName`) commandName: string,
    @Body() dto: CommandDto,
  ) {
    return await this.commandService.updateCommand(guildId, commandName, dto);
  }

  @Patch(`guilds/:guildId`)
  @UseGuards(MergedIsWhiteList)
  async updateGuildCommands(
    @Param(`guildId`) guildId: string,
    @Body() dto: CommandsEnableDto,
  ) {
    return await this.commandService.enableMany(guildId, dto.commands);
  }

  @Patch(`guilds/:guildId/:commandName/disable`)
  @UseGuards(MergedIsWhiteList)
  async delete(
    @Param(`guildId`) guildId: string,
    @Param(`commandName`) commandName: string,
  ) {
    return await this.commandService.disableCommand(guildId, commandName);
  }

  @Patch(`guilds/:guildId/disable`)
  @UseGuards(MergedIsWhiteList)
  async deleteMany(
    @Param(`guildId`) guildId: string,
    @Body() dto: CommandsDisableDto,
  ) {
    return await this.commandService.disableMany(guildId, dto.commands);
  }
}
