import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserPartnerDto } from '../dto/users.dto';

@Controller(`partners/users`)
export class UserPartnersController {
  @Get(`/`)
  getUsersPartners() {}

  @Get(`users/:userId`)
  getUserPatnerById(@Param(`userId`) userId: string) {}

  @Post()
  createPartner(@Body() dto: UserPartnerDto) {}

  @Patch(`users/:userId`)
  updateUserPartner() {}

  @Delete(`users/:userId`)
  deleteUser() {}
}
