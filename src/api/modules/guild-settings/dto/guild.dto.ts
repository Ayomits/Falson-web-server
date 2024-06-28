import { IsDate, IsEnum, IsIn, IsNumber, IsString } from 'class-validator';
import { LanguagesEnum } from 'src/api/common';
import { Badges } from 'src/api/common/types/badges';

export class GuildDto {
  @IsString()
  guildId: string;

  @IsNumber()
  type?: number;

  @IsDate()
  createdAt?: Date;

  @IsString({ each: true })
  trustedRoles?: string[];

  @IsEnum(Badges, { each: true })
  badges?: Badges[];

  @IsEnum(LanguagesEnum)
  commandLanguage?: LanguagesEnum

  @IsEnum(LanguagesEnum)
  interfaceLanguage?: LanguagesEnum

}
