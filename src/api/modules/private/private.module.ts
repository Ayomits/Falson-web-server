import { Module } from '@nestjs/common';
import { VerificationModule } from './verification/VerificationModule';
import { UsersModule } from './users/UsersModule';

@Module({
  imports: [VerificationModule, UsersModule],
  exports: [PrivateModule, VerificationModule, UsersModule],
})
export class PrivateModule {}
