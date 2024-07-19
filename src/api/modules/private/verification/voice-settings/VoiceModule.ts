import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasName } from 'src/api/types';
import { VoiceSchema } from './VoiceSchema';
import { VoiceVerificationService } from './VoiceService';
import { VoiceController } from './VoiceController';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SchemasName.VoiceVerification,
        schema: VoiceSchema,
      },
    ]),
  ],
  providers: [VoiceVerificationService],
  controllers: [VoiceController],
  exports: [VoiceModule],
})
export class VoiceModule {}
