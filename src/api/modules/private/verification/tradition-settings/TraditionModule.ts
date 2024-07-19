import { Module } from '@nestjs/common';
import { TraditionService } from './TraditionService';
import { TraditionController } from './TraditionController';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasName } from 'src/api/types';
import { TradionVerificationSchema } from './TraditionSchema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SchemasName.TradionVerification,
          schema: TradionVerificationSchema
        }
      ]
    )
  ],
  providers: [TraditionService],
  controllers: [TraditionController],
  exports: [TraditionSettingsModule],
})
export class TraditionSettingsModule {}
