import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class FooterDto {
  @IsString()
  url: string;

  @IsString()
  text: string;

  @IsDate()
  timestamp: Date;
}

export class AuthorDto {
  @IsString()
  url: string;

  @IsString()
  text: string;
}

export class EmbedDto {
  @IsString()
  guildId?: string;

  @IsString()
  title?: string;

  @IsString()
  @MinLength(1)
  description?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @MaxLength(7)
  @MinLength(7)
  @IsString()
  color?: string;

  @ValidateNested()
  @Expose()
  @IsOptional()
  footer?: FooterDto;

  @ValidateNested()
  @Expose()
  @IsOptional()
  author?: AuthorDto;
}
