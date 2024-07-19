import { IsDate, IsEnum, IsIn, IsNumber, IsString } from 'class-validator';
import { Badges, LanguagesEnum } from 'src/api/types';

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
  interfaceLanguage?: LanguagesEnum

}
