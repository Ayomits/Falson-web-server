import { IsNumber, IsString } from 'class-validator';

export class GuildDto {
  @IsString()
  guildId: string;

  @IsNumber()
  premiumStatus: string;

  @IsString({ each: true })
  canUsePanel: string[];
}
