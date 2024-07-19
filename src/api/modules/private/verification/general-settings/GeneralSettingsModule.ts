import { Module } from '@nestjs/common';
import { GeneralService } from './GeneralService';
import { GeneralController } from './GeneralController';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasName } from 'src/api/types';
import {

  GeneralVerificationSchema,
} from './GeneralSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SchemasName.GeneralVerification,
        schema: GeneralVerificationSchema,
      },
    ]),
  ],
  controllers: [GeneralController],
  providers: [GeneralService],
  exports: [GeneralSettingsModule, MongooseModule],
})
export class GeneralSettingsModule {}
