import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { config } from 'dotenv';
import { discordjsInitialize } from './discordjs';
import axios from 'axios';
import { ValidationPipe } from '@nestjs/common';
import { CreateVerificationDto } from './api/modules/verification/verification.dto';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`/api`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: true, 
      skipUndefinedProperties: true, 

    }),
  );
  await app.listen(3000).then(() => {
    console.log(`3000`);
  });
}
bootstrap();
discordjsInitialize();
