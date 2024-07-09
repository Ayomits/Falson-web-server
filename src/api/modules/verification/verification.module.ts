import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasName } from 'src/api/common';
import {
  EmbedSchema,
  GeneralVerificationSchema,
  TradionVerificationSchema,
  VoiceVerificationSchema,
} from './schemas';
import { AuthModule, GuildSettingsModule } from '../';
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
import { LogSchema } from './schemas/logs.schema';
import { LogsController } from './controllers/logs.controller';
import { LogService } from './services/logs.service';

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
        name: SchemasName.VerificationLogs,
        schema: LogSchema,
      },
    ]),
    GuildSettingsModule,
    AuthModule,
  ],
  providers: [
    VerificationService,
    EmbedService,
    VoiceVerificationService,
    TraditionVerificationService,
    GeneralService,
    LogService,
  ],
  controllers: [
    VerificationController,
    GeneralController,
    EmbedsController,
    TraditionController,
    VoiceController,
    LogsController,
  ],
  exports: [VerificationModule],
})
export class VerificationModule {}
