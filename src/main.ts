// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Убираем префикс для совместимости с тестами
  // app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  await app.listen(3001);
  console.log('🚀 Сервер запущен на http://localhost:3001');
  console.log('   Маршруты: /blogs, /posts, /users, /testing/all-data');
}
 bootstrap();