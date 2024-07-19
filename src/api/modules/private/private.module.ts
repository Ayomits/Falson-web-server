import { Module } from '@nestjs/common';
import { VerificationModule } from './verification/VerificationModule';
import { AuthModule } from './auth/AuthModule';
import { UsersModule } from './users/UsersModule';

@Module({
  imports: [VerificationModule, AuthModule, UsersModule],
  exports: [PrivateModule],
})
export class PrivateModule {}
