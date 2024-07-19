import { forwardRef, Global, Module } from '@nestjs/common';
import { UsersService } from './UsersService';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScema, Users } from './schemas/UserSchema';
import { UsersController } from './UsersController';
import { AuthModule } from '../auth/AuthModule';
import { SchemasName } from 'src/api/types';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: SchemasName.Users, schema: UserScema }]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersModule, UsersService, MongooseModule],
})
export class UsersModule {}
