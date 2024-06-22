import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { LanguagesType } from 'src/api/common/types/base.types';

export class GuildDto {
  @IsString()
  guildId: string;

  @IsNumber()
  premiumStatus?: string;

  @IsString({ each: true })
  canUsePanel?: string[];

  @Expose()
  interfaceLanguage?: LanguagesType;

  @Expose()
  commandLanguage?: LanguagesType;

  @IsNumber()
  bugHunter?: number;
}

export class GuildUsersDto {
  @IsString({ each: true })
  users: string[];
}

export class LanguagesDto {
  @Expose()
  interfaceLanguage: LanguagesType;

  @Expose()
  commandLanguage: LanguagesType;
}
