import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class VoiceVerificationDto {
  @IsString()
  guildId: string;

  @IsString({ each: true })
  @IsArray()
  @ArrayMaxSize(2)
  verificationCategories?: string[];

  @IsString({ each: true })
  @IsArray()
  @ArrayMaxSize(5)
  verificationIgnoredChannels?: string[];

  @IsString({ each: true })
  @IsArray()
  @ArrayMaxSize(25)
  verificationStaffCurators?: string[];

  @IsString({ each: true })
  verificationStaffSupports?: string;

  @IsString({ each: true })
  @IsArray()
  @ArrayMaxSize(25)
  verificationStaffFullAccess?: string[];
}
