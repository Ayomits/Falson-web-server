import { Module } from '@nestjs/common';
import { EmbedsController } from './EmbedController';
import { EmbedService } from './EmbedService';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasName } from 'src/api/types';

import { EmbedSchema } from './EmbedSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SchemasName.TradionEmbed,
        schema: EmbedSchema,
      },
    ]),
  ],
  controllers: [EmbedsController],
  providers: [EmbedService],
  exports: [EmbedsSettingsModule, MongooseModule],
})
export class EmbedsSettingsModule {}
