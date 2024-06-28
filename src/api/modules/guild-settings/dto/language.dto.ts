import { IsEnum } from "class-validator";
import { LanguagesEnum } from "src/api/common";

export class LanguagesDto {
  @IsEnum(LanguagesEnum)
  interfaceLanguage: LanguagesEnum

}