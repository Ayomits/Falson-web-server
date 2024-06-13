import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { config } from 'dotenv';
import { discordjsInitialize } from './discordjs';
import axios from 'axios';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3031);
}
bootstrap();
discordjsInitialize();
console.log('Application is running on: http://localhost:3031');
