import { forwardRef, Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScema, Users } from './users.schema';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { IsAuthGuard } from '../auth/guards/isAuth.guard';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserScema }]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, IsAuthGuard],
  exports: [UsersModule, UsersService, MongooseModule],
})
export class UsersModule {}
