import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';

import { config } from 'dotenv';
import { discordjsInitialize } from './discordjs/src';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3030);
}
bootstrap();
discordjsInitialize();
console.log();
