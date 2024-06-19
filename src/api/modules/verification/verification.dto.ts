import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import {
  ChannelIds,
  LanguagesType,
  RoleId,
  RoleIds,
} from 'src/api/common/types/base.types';

/**
 * Дтошка
 * Короче, тут будет полная схема, в остальных будут порезанные, чтобы конкретно понимать, что принимаю в request'e
 */
export class CreateVerificationDto {
  @IsString()
  guildId: string;

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
  }[];

  @ValidateNested()
  voiceVerificationChannels?: {
    category: string[];
    ignoredChannels: string[];
  };

  @ValidateNested()
  voiceVerificationStaffRoles?: {
    curator?: string[];
    support?: string;
  };

  @IsString()
  language?: string;

  @IsString({ each: true })
  verificationRoles?: string[];

  @IsBoolean()
  doubleVerification?: boolean;
}

export class UpdateVerificationDto extends PartialType(CreateVerificationDto) {
  @IsString()
  guildId: string;
}

export class RolesDto {
  roles: string[];
}

export class EmbedsDto {
  embeds: {
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
  }[];
}

export class ChangeVerificationTypeDto {
  verificationType: number;
}

export class VerificationLogsDto {
  verificationLogs: {
    feedBacks: string;
    verifications: string;
    acception: string;
  };
}

export class VoiceVerificationChannelsDto {
  voiceVerificationChannels?: {
    category: ChannelIds;
    ignoredChannels: ChannelIds;
  };
}

export class VoiceVerificationStaffRoles {
  curator?: RoleIds; // те кто могут добавлять новых саппортов
  support?: RoleId; // те кто являются саппортами
}

export class LanguagesDto {
  language: LanguagesType;
}
