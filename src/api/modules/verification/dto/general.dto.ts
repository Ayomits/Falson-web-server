import {
  ArrayMaxSize,
  ArrayMinSize,
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
  @ArrayMinSize(1)
  @ArrayMaxSize(25)
  verificationRoles?: string[];

  @IsString()
  unverifyRole?: string;

  @IsEnum(VerificationType)
  type?: VerificationType;
}
