import { Global, Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Verification, VerificationSchema } from './verification.schema';
import { GuildsService } from '../guilds/guilds.service';
import { GuildsModule } from '../guilds/guilds.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
    GuildsModule
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationModule, VerificationService],
})
export class VerificationModule {}
