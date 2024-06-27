import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CommandDto {
  @IsString()
  guildId?: string;

  @IsString()
  commandName?: string;

  @IsBoolean()
  isEnabled?: boolean;

  @IsString({ each: true })
  @IsArray()
  roles?: string[];

  @IsString({ each: true })
  @IsArray()
  channels?: string[];
}
