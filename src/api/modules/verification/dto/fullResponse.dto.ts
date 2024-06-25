import { Expose } from 'class-transformer';
import { EmbedDto } from './embed.dto';
import { GeneralVerificationDto } from './general.dto';
import { TradionVerificationDto } from './tradition.dto';
import { VoiceVerificationDto } from './voice.dto';

export class VerificationResponse {
  @Expose()
  tradition: TradionVerificationDto;

  @Expose()
  embeds: EmbedDto[];

  @Expose()
  voice: VoiceVerificationDto;

  @Expose()
  general: GeneralVerificationDto;
}
