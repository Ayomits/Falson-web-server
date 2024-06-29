import { Module } from '@nestjs/common';
import { UserPartnersController } from './controllers/users.controller';
import { GuildPartnersController } from './controllers/guilds.controller';
import { GuildPartnerService } from './services/guilds.service';
import { UserPartnersService } from './services/users.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasName } from 'src/api/common';
import { UserPartnerSchema } from './schemas/user.schema';
import { GuildPartnerSchema } from './schemas/guild.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: SchemasName.UserPartner,
        schema: UserPartnerSchema,
      },
      {
        name: SchemasName.GuildPartner,
        schema: GuildPartnerSchema,
      },
    ]),
  ],
  providers: [GuildPartnerService, UserPartnersService],
  controllers: [UserPartnersController, GuildPartnersController],
  exports: [PartnerModule, MongooseModule],
})
export class PartnerModule {}
