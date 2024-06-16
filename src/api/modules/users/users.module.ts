import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScema, Users } from './users.schema';
import { UsersController } from './users.controller';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserScema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersModule],
})
export class UsersModule {}
