import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';

// =============================================================================
// LoggingInterceptor  —  👤 Estudiante 2
// -----------------------------------------------------------------------------
// Objetivo: registrar en consola cada petición y cuánto tardó.
//
//   [Nest] 12345  - LOG [HTTP] GET /orders 3ms
//   [Nest] 12345  - LOG [HTTP] POST /orders 5ms
//   [Nest] 12345  - ERROR [HTTP] GET /orders/reports/heavy-process 3004ms - Request Timeout
//
// Operador RxJS: tap()  → ejecuta un efecto secundario (loguear) SIN
//                         modificar la respuesta.
// =============================================================================

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // TODO [Estudiante 2] Paso 1: este código corre ANTES del controller.
    //   Obtén `method` y `url` desde context.switchToHttp().getRequest<Request>()
    //   y guarda el instante de inicio: const start = Date.now();

    // TODO [Estudiante 2] Paso 2: el código dentro de tap() corre DESPUÉS del
    //   controller, cuando ya hay respuesta:
    //     next.handle().pipe(
    //       tap({
    //         next: () => this.logger.log(`${method} ${url} ${ms}ms`),
    //         error: (err) => this.logger.error(`${method} ${url} ${ms}ms - ${err.message}`),
    //       }),
    //     )
    //   donde ms = Date.now() - start.
    //
    // ⚠️ Usa this.logger (el Logger de Nest), NO console.log. Los tests lo verifican.
    //
    // Pregunta para pensar: si solo usas tap(() => ...), ¿qué pasa con las
    // peticiones que terminan en error (404, 408)? ¿Se loguean?

    // ⬇️ Reemplaza esta línea por tu implementación.
    return next.handle();
  }
}
