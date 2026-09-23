import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface.js';

// =============================================================================
// TransformInterceptor  —  👤 Estudiante 1
// -----------------------------------------------------------------------------
// Objetivo: que TODA respuesta exitosa tenga la misma forma.
//
//   Antes (lo que devuelve el controller):   [ { id: 1, ... } ]
//   Después (lo que recibe el cliente):
//   {
//     "statusCode": 200,
//     "timestamp": "2026-09-23T14:00:00.000Z",
//     "path": "/orders",
//     "data": [ { id: 1, ... } ]
//   }
//
// Operador RxJS: map()  → transforma el valor que emite el Observable.
// =============================================================================

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        data,
      })),
    );
  }
}
