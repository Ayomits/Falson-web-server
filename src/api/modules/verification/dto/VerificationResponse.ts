import {
  Embed,
  GeneralVerification,
  TradionVerification,
  VoiceVerification,
} from '../schemas';
import { Logs } from '../schemas/logs.schema';

export class VerificationResponse {
  tradition: TradionVerification;
  embeds: Embed;
  voice: VoiceVerification;
  general: GeneralVerification;
  logs: Logs;
}
