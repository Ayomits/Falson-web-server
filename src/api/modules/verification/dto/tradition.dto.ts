import { IsBoolean, IsString } from 'class-validator';

export class TradionVerificationDto {
  @IsString()
  guildId: string;

  @IsString()
  channelId?: string;

  @IsBoolean()
  isDouble?: boolean;
}
