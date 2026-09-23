import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(`API lista en      http://localhost:${port}/orders`, 'Bootstrap');
  Logger.log(`Swagger UI en     http://localhost:${port}/docs`, 'Bootstrap');
}
await bootstrap();
