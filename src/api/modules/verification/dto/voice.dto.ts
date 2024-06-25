import { IsArray, IsString } from 'class-validator';

export class VoiceVerificationDto  {

  @IsString()
  guildId: string

  @IsString({ each: true })
  @IsArray()
  verificationCategories?: string[];

  @IsString({ each: true })
  @IsArray()
  verificationIgnoredChannels?: string[];

  @IsString({ each: true })
  @IsArray()
  verificationStaffCurators?: string[];

  @IsString({ each: true })
  @IsArray()
  verificationStaffSupports?: string[];
}
