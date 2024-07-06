import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { config } from 'dotenv';
import { discordjsInitialize } from './discordjs/main';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
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
  Logger;

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(3000).then(() => {
    console.log(`3000`);
  });
}
bootstrap();
discordjsInitialize();
