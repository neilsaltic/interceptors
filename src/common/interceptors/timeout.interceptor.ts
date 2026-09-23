import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  Observable,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';

// =============================================================================
// TimeoutInterceptor  —  👤 Estudiante 3
// -----------------------------------------------------------------------------
// Objetivo: si el controller tarda más de 3 segundos, cortar la petición y
// responder 408 en vez de dejar al cliente esperando.
//
//   GET /orders/reports/heavy-process  (tarda ~4.5 s)
//   → HTTP 408
//   { "statusCode": 408, "message": "La petición excedió el tiempo límite de 3000 ms", "error": "Request Timeout" }
//
// Operadores RxJS:
//   timeout(ms)   → si el Observable no emite en `ms`, lanza un TimeoutError.
//   catchError()  → atrapa ese error y lo convierte en una excepción HTTP de Nest.
// =============================================================================

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  // El límite es configurable para poder reutilizar el interceptor con
  // otros valores, p. ej. @UseInterceptors(new TimeoutInterceptor(10_000)).
  constructor(private readonly timeoutMs = 3000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // TODO [Estudiante 3] Paso 1: aplica timeout(this.timeoutMs) al flujo:
    //   next.handle().pipe( timeout(...), catchError(...) )

    // TODO [Estudiante 3] Paso 2: dentro de catchError((err) => { ... }):
    //   - Si `err instanceof TimeoutError` → return throwError(() =>
    //       new RequestTimeoutException(`La petición excedió el tiempo límite de ${this.timeoutMs} ms`));
    //   - Si es CUALQUIER OTRO error (ej. NotFoundException) → re-lánzalo
    //     tal cual con throwError(() => err). ¡No lo conviertas en 408!
    //
    // Pregunta para pensar: cuando se dispara el timeout, ¿se detiene de
    // verdad el trabajo del servicio (el setTimeout de 4.5 s) o solo dejamos
    // de esperarlo?

    // ⬇️ Reemplaza esta línea por tu implementación.
    return next.handle();
  }
}
