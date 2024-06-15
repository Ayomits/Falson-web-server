import { Module } from '@nestjs/common';
import { GuildsController } from './guilds.controller';
import { GuildsService } from './guilds.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Guilds, GuildsSchema } from './guilds.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Guilds.name, schema: GuildsSchema }]),
  ],
  controllers: [GuildsController],
  providers: [GuildsService],
  exports: [GuildsModule, GuildsService]
})
export class GuildsModule {}
