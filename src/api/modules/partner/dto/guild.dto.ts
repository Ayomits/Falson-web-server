import { IsEnum, IsString } from 'class-validator';
import { PartnerPriority } from 'src/api/common/types/PartnerType';

export class GuildPartnerDto {
  @IsString()
  guildId: string;

  @IsString()
  invite: string;

  @IsEnum(PartnerPriority)
  priority: PartnerPriority;
}
