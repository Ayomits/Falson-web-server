import { IsString, IsTaxId, MaxLength, MinLength } from 'class-validator';

export class GeneralVerificationDto {
  @IsTaxId()
  guildId: string;

  @IsString()
  feedbacksLog?: string;

  @IsString()
  acceptionLog?: string;

  @IsString()
  verificationLog?: string;

  @IsString({ each: true })
  @MaxLength(25)
  @MinLength(1)
  verificationRoles?: string[];

  @IsString()
  unverifyRole?: string
}
