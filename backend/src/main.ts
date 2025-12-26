import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const client = process.env.CLIENT_API;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [client],
    methods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE']
  });
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(3001);
  }
}
bootstrap();
