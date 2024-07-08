import { IsString } from "class-validator";

export class LogsDto {
  @IsString()
  guildId: string

  @IsString()
  feedbacksLog?: string;

  @IsString()
  acceptionLog?: string;

  @IsString()
  verificationLog?: string;
}
