import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { Request } from 'express';
import { CreateVerificationDto } from './verification.dto';
import { IsBotGuard } from '../auth/guards/isBot.guard';
import { IsAuthGuard } from '../auth/guards/isAuth.guard';
import { IsWhiteListGuard } from '../auth/guards/IsWhiteList.guard';
import { PremiumStatus } from '../auth/guards/premiumStatus.guard';
import { PremiumEnum } from 'src/api/common/types/base.types';

@Controller('verifications')
export class VerificationController {
  constructor(
    @Inject(VerificationService)
    private readonly verificationService: VerificationService,
  ) {}

  @Get(':guildId')
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  @HttpCode(HttpStatus.OK)
  async getVerificationByGuildId(@Param('guildId') guildId: string) {
    return this.verificationService.findByGuildId(guildId);
  }

  @Post()
  @UseGuards(IsBotGuard)
  @HttpCode(HttpStatus.CREATED)
  async createVerification(@Req() req: Request, @Body() dto: CreateVerificationDto) {
    const guildId = req.body.guildId;
    return this.verificationService.createAllSettings(guildId, dto);
  }

  @Patch(':guildId/verification-type')
  @PremiumStatus(PremiumEnum.NoPrem)
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  async updateVerificationType(
    @Param('guildId') guildId: string,
    @Body() dto: Partial<CreateVerificationDto['verificationType']>,
  ) {
    return this.verificationService.verificationTypeUpdate(guildId, dto);
  }

  @Patch(':guildId/verification-embeds/premium')
  @PremiumStatus(PremiumEnum.Donater)
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  async updatePremiumVerificationEmbeds(
    @Param('guildId') guildId: string,
    @Body() embeds: Partial<CreateVerificationDto['tradionVerificationEmbed']>,
  ) {
    return this.verificationService.premiumUpdateEmbeds(guildId, embeds);
  }

  @Put(':guildId/verification-embeds/default')
  @PremiumStatus(PremiumEnum.NoPrem)
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  async updateDefaultVerificationEmbeds(
    @Param('guildId') guildId: string,
    @Body() embed: Partial<CreateVerificationDto['tradionVerificationEmbed'][0]>,
  ) {
    return this.verificationService.defaultUpdateEmbeds(guildId, embed);
  }

  @Patch(':guildId/verification-language')
  @PremiumStatus(PremiumEnum.NoPrem)
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  async updateVerificationLanguage(
    @Param('guildId') guildId: string,
    @Body() dto: Partial<CreateVerificationDto['language']>,
  ) {
    return this.verificationService.updateLanguage(guildId, dto);
  }

  @Put(':guildId/verification-logs')
  @PremiumStatus(PremiumEnum.NoPrem)
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  async updateVerificationLogs(
    @Param('guildId') guildId: string,
    @Body() dto: Partial<CreateVerificationDto['verificationLogs']>,
  ) {
    return this.verificationService.updateVerificationLogs(guildId, dto);
  }

  @Put(':guildId/verification-roles')
  @PremiumStatus(PremiumEnum.NoPrem)
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  async updateVerificationRoles(
    @Param('guildId') guildId: string,
    @Body() dto: Partial<CreateVerificationDto['verificationRoles']>,
  ) {
    return this.verificationService.updateVerificationRoles(guildId, dto);
  }

  @Patch(':guildId/voice-verification-channels')
  @PremiumStatus(PremiumEnum.NoPrem)
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  async updateVoiceVerificationChannels(
    @Param('guildId') guildId: string,
    @Body() dto: Partial<CreateVerificationDto['voiceVerificationChannels']>,
  ) {
    return this.verificationService.voiceVerificationChannels(
      guildId,
      dto as CreateVerificationDto['voiceVerificationChannels'],
    );
  }

  @Patch(':guildId/voice-verification-staff-roles')
  @PremiumStatus(PremiumEnum.NoPrem)
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  async updateVoiceVerificationStaffRoles(
    @Param('guildId') guildId: string,
    @Body() dto: Partial<CreateVerificationDto['voiceVerificationStaffRoles']>,
  ) {
    return this.verificationService.voiceVerificationStaffRoles(guildId, dto);
  }

  @Patch(':guildId/double-verification-settings')
  @PremiumStatus(PremiumEnum.NoPrem)
  @UseGuards(IsAuthGuard, IsWhiteListGuard)
  async updateDoubleVerificationSettings(
    @Param('guildId') guildId: string,
    @Body() dto: Partial<CreateVerificationDto['doubleVerification']>,
  ) {
    return this.verificationService.doubleVerification(guildId, dto);
  }

  @Delete(':guildId')
  @UseGuards(IsBotGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVerification(@Param('guildId') guildId: string) {
    return await this.verificationService.deleteVerification(guildId);
  }
}
