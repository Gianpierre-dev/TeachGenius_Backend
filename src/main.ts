import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: config.cors.origin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(config.port);
  console.log(`Server running on port ${config.port}`);
}
bootstrap();
