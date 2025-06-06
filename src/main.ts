import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, VersioningType } from '@nestjs/common';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  const config = new DocumentBuilder()
    .setTitle('E-Wallet API')
    .setDescription('Documentation de l API pour l application e-wallet')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const logger: Logger = new Logger(AppModule.name);
  const port = process.env.PORT || 3000;
  await app.listen(port,'0.0.0.0', ()=>{
    logger.verbose(`API is listening on: ${port}`);
    logger.verbose(`Swagger Docs on: http://localhost:${port}/api/docs`);
  });
}
bootstrap();
