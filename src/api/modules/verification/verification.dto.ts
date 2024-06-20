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
  feedBacks?: string;
  @IsString()
  verifications?: string;
}

@Exclude()
@Expose()
export class SubChannelsDto {
  @IsString({ each: true })
  @IsArray()
  category: string[];
  @IsString({ each: true })
  @IsArray()
  ignoredChannels: string[];
}

@Exclude()
@Expose()
export class SubRolesDto {
  @IsString({ each: true })
  @IsArray()
  curator?: string[];
  @IsString()
  support?: string;
}

@Exclude({ toClassOnly: true, toPlainOnly: true })
@Expose()
export class SubEmbedDto {
  
  @IsString()
  @IsUrl()
  url?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  value: string;
}
@Exclude()
export class EmbedDto {
  @Expose()
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @MinLength(1)
  thumbnail?: string;

  @IsString()
  @MinLength(1)
  color: `#${string}`;

  @IsString()
  @MinLength(1)
  @IsUrl()
  image?: string;

  @ValidateNested()
  @Type(() => SubEmbedDto)
  author?: SubEmbedDto;
  @ValidateNested()
  @Type(() => SubEmbedDto)
  footer?: SubEmbedDto;
}

@Exclude()
export class RolesDto {
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

export class VoiceVerificationStaffRolesDto {
  curator?: RoleIds; // те кто могут добавлять новых саппортов
  support?: RoleId; // те кто являются саппортами
}

export class VerificationRoles {
  @IsString({ each: true })
  roles: string[];
}

export class LanguagesDto {
  language: LanguagesType;
}

/**
 * Дтошка
 * Короче, тут будет полная схема, в остальных будут порезанные, чтобы конкретно понимать, что принимаю в request'e
 */
@Exclude()
export class CreateVerificationDto {
  @IsString()
  guildId: string;

  @IsOptional()
  @IsNumber()
  verificationType?: number;

  @IsOptional()
  @ValidateNested()
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
  @IsIn(validLanguages) // Предположим, что validLanguages содержит массив доступных языков
  language?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  verificationRoles?: string[];

  @IsOptional()
  @IsBoolean()
  doubleVerification?: boolean;
}


export class UpdateVerificationDto extends PartialType(CreateVerificationDto) {
  @IsString()
  guildId: string;
}
