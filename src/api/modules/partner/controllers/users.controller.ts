import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserPartnerDto } from '../dto/users.dto';
import { UserPartnersService } from '../services/users.service';
import { MergedUserTypeGuard } from 'src/api/guards/merged/mergedUserType.guard';
import { UserType } from 'src/api/common/types/user';
import { UserTypeDecorator } from 'src/api/guards/UserType.guard';

@Controller(`partners/users`)
export class UserPartnersController {
  constructor(private userPartnerService: UserPartnersService) {}

  @Get(`/`)
  getUsersPartners() {
    return this.userPartnerService.findAll();
  }

  @Get(`users/:userId`)
  getUserPatnerById(@Param(`userId`) userId: string) {
    return this.userPartnerService.findByUserId(userId);
  }

  @Post()
  @UserTypeDecorator(UserType.developer)
  @UserTypeDecorator(UserType.developer)
  createPartner(@Body() dto: UserPartnerDto) {
    return this.userPartnerService.create(dto);
  }

  @Patch(`users/:userId`)
  @UserTypeDecorator(UserType.developer)
  @UseGuards(MergedUserTypeGuard)
  updateUserPartner(
    @Param(`userId`) userId: string,
    @Body() dto: UserPartnerDto,
  ) {
    return this.userPartnerService.update(userId, dto);
  }

  @Delete(`users/:userId`)
  @UserTypeDecorator(UserType.developer)
  @UseGuards(MergedUserTypeGuard)
  deleteUser(@Param(`userId`) userId: string) {
    return this.userPartnerService.delete(userId);
  }
}
