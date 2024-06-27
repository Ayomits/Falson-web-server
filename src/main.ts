import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { config } from 'dotenv';
import { discordjsInitialize } from './discordjs/main';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
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

  await app.listen(3000).then(() => {
    console.log(`3000`);
  });
}
bootstrap();
discordjsInitialize();
