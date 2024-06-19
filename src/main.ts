import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { config } from 'dotenv';
import { discordjsInitialize } from './discordjs';
import axios from 'axios';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`/api`)
  await app.listen(3000).then(() => {console.log(`3000`)});
}
bootstrap();
discordjsInitialize();
