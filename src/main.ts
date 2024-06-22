import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { config } from 'dotenv';
import { discordjsInitialize } from './discordjs';
import { ValidationPipe } from '@nestjs/common';
import middleware from 'i18next-express-middleware';
import i18n from './i18n';

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
  app.use(middleware.handle(i18n))
  await app.listen(3000).then(() => {
    console.log(`3000`);
  });
}
bootstrap();
discordjsInitialize();
