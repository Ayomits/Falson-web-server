import {
  IsEnum,
  IsString,
  IsTaxId,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VerificationType } from 'src/api/common';

export class GeneralVerificationDto {
  @IsTaxId()
  guildId: string;

  @IsString({ each: true })
  @MaxLength(25)
  @MinLength(1)
  verificationRoles?: string[];

  @IsString()
  unverifyRole?: string;

  @IsEnum(VerificationType)
  verificationType: number;
}
