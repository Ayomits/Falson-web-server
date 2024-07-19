import { IsEnum } from "class-validator";
import { LanguagesEnum } from "src/api/types";

export class LanguagesDto {
  @IsEnum(LanguagesEnum)
  interfaceLanguage: LanguagesEnum

}