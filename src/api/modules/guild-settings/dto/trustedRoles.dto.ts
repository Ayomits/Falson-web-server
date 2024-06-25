import { IsArray, IsString } from 'class-validator';

export class TrustedRolesDto {
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
