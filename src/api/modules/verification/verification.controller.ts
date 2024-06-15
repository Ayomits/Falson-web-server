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
import { IsBotGuard } from 'src/api/guards/isBot.guard';

@Controller('verification')
export class VerificationController {
  constructor(
    @Inject(VerificationService)
    private readonly verificationService: VerificationService,
  ) {}

  @Get(`:guildId`)
  @HttpCode(HttpStatus.OK)
  async findByGuildId(@Param() guildId: string) {
    return this.verificationService.findByGuildId(guildId);
  }

  @Post()
  @HttpCode(201)
  @UseGuards()
  async create(@Req() req: Request, @Body() dto: CreateVerificationDto) {
    const guildId = req.body.guildId;
    return this.verificationService.createAllSettings(guildId, dto);
  }

  @Patch(`:guildId`)
  @UseGuards()
  async update(@Body() dto: UpdateVerificationDto) {
    return this.verificationService.updateVerification(dto.guildId, dto as any);
  }

  @Delete(':guildId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(IsBotGuard)
  async delete(@Param('guildId') guildId: string) {
    return await this.verificationService.deleteVerification(guildId);
  }
}
