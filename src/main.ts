import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalErrorHandlerFilter } from './common/filters/all-exceptions.filter';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Courier API')
    .setDescription('Courier Service API documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalErrorHandlerFilter());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
