import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  ChannelIds,
  LanguagesType,
  RoleId,
  RoleIds,
  validLanguages,
} from 'src/api/common/types/base.types';

@Exclude()
@Expose()
export class SubChannelDto {
  @IsString()
  @Expose()
  feedBacks?: string;

  @IsString()
  @Expose()
  verifications?: string;
}

@Exclude()
@Expose()
export class SubChannelsDto {
  @IsString({ each: true })
  @Expose()
  @IsArray()
  category: string[];

  @IsString({ each: true })
  @Expose()
  @IsArray()
  ignoredChannels: string[];
}

@Exclude()
@Expose()
export class SubRolesDto {
  @IsString({ each: true })
  @Expose()
  @IsArray()
  curator?: string[];

  @IsString()
  @Expose()
  support?: string;
}

@Exclude({ toClassOnly: true, toPlainOnly: true })
@Expose()
export class SubEmbedDto {
  @IsString()
  @Expose()
  @IsUrl()
  url?: string;

  @IsString()
  @MinLength(1)
  @Expose()
  @MaxLength(128)
  value: string;
}
@Exclude()
export class EmbedDto {
  @Expose()
  @IsString()
  @Expose()
  @MinLength(1)
  title: string;

  @IsString()
  @Expose()
  @MinLength(1)
  description: string;

  @IsString()
  @Expose()
  @MinLength(1)
  thumbnail?: string;

  @IsString()
  @Expose()
  @MinLength(1)
  color: `#${string}`;

  @IsString()
  @Expose()
  @MinLength(1)
  @IsUrl()
  image?: string;

  @ValidateNested()
  @Expose()
  @Type(() => SubEmbedDto)
  author?: SubEmbedDto;

  @ValidateNested()
  @Expose()
  @Type(() => SubEmbedDto)
  footer?: SubEmbedDto;
}

@Exclude()
export class RolesDto {
  @Expose()
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
@Exclude()
export class EmbedsDto {
  @IsArray()
  @MinLength(1)
  @MaxLength(25)
  @Expose()
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
  @Expose()
  @IsNumber()
  verificationType: number;
}

export class VerificationLogsDto {
  @Expose()
  @ValidateNested()
  verificationLogs: {
    feedBacks: string;
    verifications: string;
    acception: string;
  };
}

export class VoiceVerificationChannelsDto {
  @Expose()
  @ValidateNested()
  voiceVerificationChannels?: {
    category: ChannelIds;
    ignoredChannels: ChannelIds;
  };
}

export class VoiceVerificationStaffRolesDto {
  @Expose()
  curator?: RoleIds; // те кто могут добавлять новых саппортов
  @Expose()
  support?: RoleId; // те кто являются саппортами
}

export class VerificationRoles {
  @IsString({ each: true })
  @Expose()
  roles: string[];
}

export class LanguagesDto {
  @IsString()
  @Expose()
  language: LanguagesType;
}

/**
 * Дтошка
 * Короче, тут будет полная схема, в остальных будут порезанные, чтобы конкретно понимать, что принимаю в request'e
 */
@Exclude()
export class CreateVerificationDto {
  @IsString()
  @IsOptional()
  @Expose()
  guildId?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  verificationType?: number;

  @IsOptional()
  @ValidateNested()
  @Expose()
  verificationLogs?: SubChannelDto;

  @IsOptional()
  @IsArray()
  @Type(() => EmbedDto)
  @Expose()
  @MinLength(1)
  @MaxLength(25)
  tradionVerificationEmbed?: EmbedDto[];

  @IsOptional()
  @Expose()
  @ValidateNested()
  voiceVerificationChannels?: SubChannelsDto;

  @IsOptional()
  @Expose()
  @ValidateNested()
  voiceVerificationStaffRoles?: SubRolesDto;

  @IsOptional()
  @IsString()
  @Expose()
  @IsIn(validLanguages) // Предположим, что validLanguages содержит массив доступных языков
  language?: string;

  @IsOptional()
  @IsArray()
  @Expose()
  @IsString({ each: true })
  verificationRoles?: string[];

  @IsOptional()
  @IsBoolean()
  @Expose()
  doubleVerification?: boolean;
}

export class UpdateVerificationDto extends PartialType(CreateVerificationDto) {
  @IsString()
  guildId: string;
}
