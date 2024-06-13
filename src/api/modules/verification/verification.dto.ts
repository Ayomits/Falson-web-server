import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { ChannelIds, RoleId, RoleIds } from 'src/api/common/types/base.types';

/**
 * Дтошка
 * Короче, тут будет полная схема, в остальных будут порезанные, чтобы конкретно понимать, что принимаю в request'e
 */
export class CreateVerificationDto {

  @IsNumber()
  verificationType?: number;

  @ValidateNested()
  verificationLogs?: {
    feedBacks?: string;
    verifications?: string;
  };

  @ValidateNested()
  tradionVerificationEmbed?: {
    title: string;
    description: string;
    thumbnail?: string;
    color: `#${string}`;
    image?: string;
    author?: {
      url?: string;
      value: string;
    };
    footer?: {
      url: string;
      value: string;
    };
  };

  @ValidateNested()
  voiceVerificationChannels?: {
    category: ChannelIds;
    ignoredChannels: ChannelIds;
  };

  @ValidateNested()
  voiceVerificationStaffRoles?: {
    curator?: RoleIds;
    support?: RoleId;
  };
}

export class UpdateVerificationDto extends PartialType(CreateVerificationDto) {
  @IsString()
  guildId: string
}