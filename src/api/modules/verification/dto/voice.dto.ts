import { IsArray, IsString, Max, MaxLength } from 'class-validator';

export class VoiceVerificationDto {
  @IsString()
  guildId: string;

  @IsString({ each: true })
  @IsArray()
  @Max(2)
  verificationCategories?: string[];

  @IsString({ each: true })
  @IsArray()
  @MaxLength(5)
  verificationIgnoredChannels?: string[];

  @IsString({ each: true })
  @IsArray()
  @MaxLength(25)
  verificationStaffCurators?: string[];

  @IsString({ each: true })
  @IsArray()
  @MaxLength(25)
  verificationStaffSupports?: string[];

  @IsString({ each: true })
  @IsArray()
  @MaxLength(25)
  verificationStaffFullAccess?: string[];
}
