import { forwardRef, Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScema, Users } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { SchemasName } from 'src/api/common';

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
