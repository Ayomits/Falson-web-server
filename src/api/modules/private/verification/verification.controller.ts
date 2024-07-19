import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { VerificationService } from './VerificationService';


@Controller('verifications')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Get(`:guildId`)
  findVerification(@Param(`guildId`) guildId: string) {
    return this.verificationService.allVerifications(guildId);
  }

}
