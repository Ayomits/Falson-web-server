import { IsNumber, IsString } from 'class-validator';
import { LanguagesType } from 'src/api/common/types/base.types';

export class GuildDto {
  @IsString()
  guildId: string;

  @IsNumber()
  premiumStatus?: string;

  @IsString({ each: true })
  canUsePanel?: string[];

  @IsString()
  language?: LanguagesType;

  @IsNumber()
  bugHunter?: number
}

export class GuildUsersDto {
  @IsString({each: true})
  users: string[];
}
