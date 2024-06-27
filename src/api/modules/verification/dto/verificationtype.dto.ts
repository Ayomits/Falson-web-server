import { IsNumber, Max, Min } from "class-validator";
import { VerificationType } from "src/api/common";

export class VerificationTypeDto{
  @IsNumber()
  @Max(VerificationType.Both)
  @Min(VerificationType.Traditional)
  verificationType: number
}
