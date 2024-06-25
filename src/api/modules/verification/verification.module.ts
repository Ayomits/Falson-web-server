import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasName } from 'src/api/common';
import {
  EmbedSchema,
  GeneralVerificationSchema,
  TradionVerificationSchema,
  VerificationSchema,
  VoiceVerificationSchema,
} from './schemas';
import { GuildSettingsModule } from '../';
import {
  EmbedService,
  GeneralService,
  TraditionVerificationService,
  VoiceVerificationService,
} from './services';
import {
  EmbedsController,
  GeneralController,
  TraditionController,
  VoiceController,
} from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SchemasName.GeneralVerification,
        schema: GeneralVerificationSchema,
      },
      {
        name: SchemasName.TradionEmbed,
        schema: EmbedSchema,
      },
      {
        name: SchemasName.VoiceVerification,
        schema: VoiceVerificationSchema,
      },
      {
        name: SchemasName.TradionVerification,
        schema: TradionVerificationSchema,
      },
      {
        name: SchemasName.AllVerifications,
        schema: VerificationSchema,
      },
    ]),
    GuildSettingsModule,
  ],
  providers: [
    VerificationService,
    EmbedService,
    VoiceVerificationService,
    TraditionVerificationService,
    GeneralService,
  ],
  controllers: [
    VerificationController,
    GeneralController,
    EmbedsController,
    TraditionController,
    VoiceController,
  ],
  exports: [VerificationModule],
})
export class VerificationModule {}
