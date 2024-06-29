import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { PartnerPriority } from 'src/api/common/types/PartnerType';

export class UserPartnerDto {
  @IsString()
  userId: string;

  @IsEnum(PartnerPriority)
  priority: PartnerPriority;
}
