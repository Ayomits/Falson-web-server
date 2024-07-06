import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationTypeDto } from './dto/verificationtype.dto';
import { MergedIsWhiteList } from '../../guards';

@Controller('verifications')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Get(`:guildId`)
  @UseGuards(MergedIsWhiteList)
  findVerification(@Param(`guildId`) guildId: string) {
    return this.verificationService.allVerifications(guildId);
  }

  @Patch(`:guildId/type`)
  @UseGuards(MergedIsWhiteList)
  updateVerificationType(
    @Param(`guildId`) guildId: string,
    @Body() verificationType: VerificationTypeDto,
  ) {
    return this.verificationService.updateVerificationType(guildId, verificationType)
  }
}
