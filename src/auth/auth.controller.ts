import { Controller, Get } from '@nestjs/common';
import { client } from 'src/main';

@Controller('auth')
export class AuthController {
  @Get('/')
  async login() {
    const channels = client.guilds.cache.get('1094361959090114563').channels.cache;
    if (channels) {
      return {"channels": channels}
    }
    return {"channels": null}
  }
}
