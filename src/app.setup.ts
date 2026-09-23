import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { SanitizeInterceptor } from './common/interceptors/sanitize.interceptor.js';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

/**
 * Configuración global de la app. Se usa tanto en main.ts como en los tests
 * e2e, para que ambos prueben EXACTAMENTE la misma aplicación.
 */
export function configureApp(app: INestApplication): void {
  // Valida los DTOs con class-validator y rechaza campos que no existan en él.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ---------------------------------------------------------------------------
  // Interceptores globales (ya registrados: solo tienen que implementarlos).
  //
  // ⚠️ EL ORDEN IMPORTA. Nest los ejecuta como capas de una cebolla:
  //
  //   petición  ─►  Logging ─► Timeout ─► Transform ─► Sanitize ─► Controller
  //   respuesta ◄─  Logging ◄─ Timeout ◄─ Transform ◄─ Sanitize ◄─┘
  //
  //   - Logging va afuera: mide el tiempo TOTAL y ve también los errores 408.
  //   - Sanitize va adentro: limpia los datos crudos ANTES de que Transform
  //     los envuelva en { statusCode, timestamp, path, data }.
  //
  // Pregunta para el equipo: ¿qué pasaría si Sanitize estuviera antes que
  // Transform en esta lista?
  // ---------------------------------------------------------------------------
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor(3000),
    new TransformInterceptor(),
    new SanitizeInterceptor(),
  );

  // ---------------------------------------------------------------------------
  // Swagger / OpenAPI
  //   UI:   http://localhost:3000/docs
  //   JSON: http://localhost:3000/docs-json
  //
  // TODO [Estudiante 2 - Swagger]: completa la ficha de la API.
  //   - .setTitle('Orders & Products API')
  //   - .setDescription('...')  → explica qué hace la API y el formato de respuesta.
  //   - .setVersion('1.0')
  //   - .addTag('orders', 'Gestión de pedidos')
  //   - .setContact('Equipo X', '', 'equipo@example.com')
  //   Bonus: en SwaggerModule.setup pasa { customSiteTitle: 'Orders API Docs' }.
  // ---------------------------------------------------------------------------
  const config = new DocumentBuilder().build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
