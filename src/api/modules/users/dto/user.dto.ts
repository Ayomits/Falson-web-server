import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';

export class UserDto {
  @IsString()
  userId: string;

  @ValidateNested()
  @Expose()
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };

  @IsDate()
  createdAt?: Date;

  @IsNumber()
  type?: number;
}
