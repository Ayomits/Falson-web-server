import { Controller, Get, Param } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verifications')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Get(`:guildId`)
  async findVerification(@Param(`guildId`) guildId: string) {
    return await this.verificationService.allVerifications(guildId);
  }
}
