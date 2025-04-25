import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use(helmet());

  const swagger = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('E-commerce API')
    .setDescription('E-commerce API documentation with NestJS')
    .setTermsOfService('https://www.google.com/policies/terms/')
    .addServer('http://localhost:3000')
    .addSecurity('Bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer token',
    })
    .build();

  const documentation = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, documentation);

  await app.listen(process.env.PORT);
}

bootstrap();
