import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { Request } from 'express';
import {
  CreateVerificationDto,
  RolesDto,
  UpdateVerificationDto,
} from './verification.dto';

@Controller('verification')
export class VerificationController {
  constructor(
    @Inject(VerificationService)
    private readonly verificationService: VerificationService,
  ) {}

  @Get(`:guildId`)
  /**
   * Объединённая гарда. 
   * Только бот + сервер овнер + вайтлист
   */
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  async findByGuildId(@Param() guildId: string) {
    return this.verificationService.findByGuildId(guildId);
  }

  @Post()
  /**
   * Только сервер овнер + бот
   */
  @HttpCode(201)
  @UseGuards()
  async create(@Req() req: Request, @Body() dto: CreateVerificationDto) {
    const guildId = req.body.guildId;
    return this.verificationService.createAllSettings(guildId, dto);
  }

  @Patch(`:guildId`)
  /**
   * Только сервер овнер + бот + вайтлист
   * 
   * По поводу фич, что под премкой и т.п. 
   * Сейчас вшито, что если ты не донатер, то с тем чтобы поменять эмбед ты идёшь нахуй
   * Но позже, мб, сделаю распил на куча эндпоинтов
   * Пока что выпустится хочу : )
   */
  @UseGuards()
  async update(@Body() dto: UpdateVerificationDto) {
    return this.verificationService.updateVerification(dto.guildId, dto as any);
  }

  @Delete(':guildId')
  /**
   * Только бот
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(IsBotGuard)
  async delete(@Param('guildId') guildId: string) {
    return await this.verificationService.deleteVerification(guildId);
  }
}
