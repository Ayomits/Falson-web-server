import { Controller, Get } from '@nestjs/common';
import { ClientFetcher } from 'src/common/clientFetcher.class';

import { client } from 'src/main';

@Controller('auth')
export class AuthController {
  clientService = new ClientFetcher(client)

  @Get('/')
  async login() {
    return this.clientService.getAdminsGuild("1129162686194790572")
  }
}
