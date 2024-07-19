import { Module } from '@nestjs/common';
import { LogService } from './LogService';
import { LogsController } from './LogController';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasName } from 'src/api/types';
import { LogSchema } from './LogSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SchemasName.VerificationLogs,
        schema: LogSchema
      }
    ])
  ],
  providers: [LogService],
  controllers: [LogsController],
  exports: [LogsSettingsModule, MongooseModule]
})
export class LogsSettingsModule {}
