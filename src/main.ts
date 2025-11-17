import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalErrorHandlerFilter } from './common/filters/all-exceptions.filter';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

const server = express();
async function bootstrap() {

  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: true,
    logger:['error','warn','log','debug','verbose']
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


  app.useGlobalInterceptors(new LoggingInterceptor);


  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
