import {
  ArrayMaxSize,
  IsEnum,
  IsString,
  IsTaxId,
} from 'class-validator';
import { VerificationType } from 'src/api/types';


export class GeneralVerificationDto {
  @IsTaxId()
  guildId: string;

  @IsString({ each: true })
  @ArrayMaxSize(25)
  verificationRoles?: string[];

  @IsString()
  unverifyRole?: string;

  @IsEnum(VerificationType)
  type?: VerificationType;
}
