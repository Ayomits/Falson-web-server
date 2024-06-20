import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Verification, VerificationSchema } from './verification.schema';
import { GuildsModule } from '../guilds/guilds.module';
import { AuthModule } from '../auth/auth.module';
import { ExistedGuildMiddleware } from 'src/api/common/middlewares/existedGuild.middleware';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
    GuildsModule,
    AuthModule
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationModule, VerificationService, MongooseModule],
})
export class VerificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExistedGuildMiddleware)
      .forRoutes(VerificationController); 
  }
}
