import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScema, Users } from './users.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserScema }]),
  ],
  providers: [UsersService],
  exports: [UsersService, UsersModule],
})
export class UsersModule {}
