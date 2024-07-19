import { Module } from '@nestjs/common';
import { VerificationService } from './VerificationService';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from './logs-settings/LogSchema';
import { LogsController } from './logs-settings/LogController';
import { SchemasName } from 'src/api/types';
import { GeneralVerificationSchema } from './general-settings/GeneralSchema';
import { EmbedSchema } from './embeds-settings/EmbedSchema';
import { TradionVerificationSchema } from './tradition-settings/TraditionSchema';
import { GuildSettingsModule } from '../guild-settings/GuildSettingsModule';
import { AuthModule } from '../auth/AuthModule';
import { EmbedService } from './embeds-settings/EmbedService';
import { VoiceVerificationService } from './voice-settings/VoiceService';
import { TraditionService } from './tradition-settings/TraditionService';
import { GeneralService } from './general-settings/GeneralService';
import { LogService } from './logs-settings/LogService';
import { GeneralController } from './general-settings/GeneralController';
import { EmbedsController } from './embeds-settings/EmbedController';
import { TraditionController } from './tradition-settings/TraditionController';
import { VoiceController } from './voice-settings/VoiceController';
import { VoiceSchema } from './voice-settings/VoiceSchema';
import { EmbedsSettingsModule } from './embeds-settings/EmbedModule';
import { GeneralSettingsModule } from './general-settings/GeneralSettingsModule';
import { LogsSettingsModule } from './logs-settings/LogModule';
import { TraditionSettingsModule } from './tradition-settings/TraditionModule';
import { VoiceModule } from './voice-settings/VoiceModule';

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
        schema: VoiceSchema,
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
    EmbedsSettingsModule,
    GeneralSettingsModule,
    LogsSettingsModule,
    TraditionSettingsModule,
    VoiceModule,
    GuildSettingsModule,
    AuthModule,
  ],
  providers: [
    VerificationService,
    EmbedService,
    VoiceVerificationService,
    TraditionService,
    GeneralService,
    LogService,
  ],
  controllers: [
    GeneralController,
    EmbedsController,
    TraditionController,
    VoiceController,
    LogsController,
  ],
  exports: [VerificationModule],
})
export class VerificationModule {}
