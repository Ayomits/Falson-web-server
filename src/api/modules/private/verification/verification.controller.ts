import { Controller, Get, Param } from '@nestjs/common';
import { VerificationService } from './VerificationService';
import { RouteProtectLevel } from 'src/api/decorators/RouteProtectDecorator';
import { RouteType } from 'src/api/types/RouteType';

@Controller('verifications')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Get(`:guildId`)
  @RouteProtectLevel(RouteType.WHITE_LIST_BOT)
  findVerification(@Param(`guildId`) guildId: string) {
    return this.verificationService.allVerifications(guildId);
  }
}
