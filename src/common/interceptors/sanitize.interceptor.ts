import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

// =============================================================================
// SanitizeInterceptor  —  👤 Estudiante 4
// -----------------------------------------------------------------------------
// Objetivo: que ningún dato sensible salga de la API, sin importar qué
// endpoint lo devuelva.
//
//   Lo que devuelve el servicio:            Lo que recibe el cliente:
//   "customer": {                           "customer": {
//     "name": "Ana Pérez",                    "name": "Ana Pérez",
//     "passwordHash": "$2b$10$..."            (sin passwordHash)
//   },                                      },
//   "payment": {                            "payment": {
//     "creditCard": "4111111111114242",       "creditCard": "**** **** **** 4242"
//     "clientSecret": "pi_..._secret_..."     (sin clientSecret)
//   }                                       }
//
// Operador RxJS: map()  → transforma el valor antes de enviarlo.
// =============================================================================

/** Campos que se ELIMINAN por completo de la respuesta. */
export const REMOVED_FIELDS = ['passwordHash', 'clientSecret'];

/** Campos que se ENMASCARAN (solo quedan visibles los últimos 4 dígitos). */
export const MASKED_FIELDS = ['creditCard'];

/**
 * '4111111111114242' → '**** **** **** 4242'
 */
export function maskCreditCard(value: string): string {
  // TODO [Estudiante 4] Paso 1: devuelve '**** **** **** ' + los últimos 4
  //   caracteres. Pista: value.slice(-4)

  // ⬇️ Reemplaza esta línea por tu implementación.
  return value;
}

/**
 * Recorre CUALQUIER valor (objeto, array, primitivo) y devuelve una COPIA
 * limpia. Debe funcionar igual para un pedido suelto que para un array de
 * pedidos, y para objetos anidados a cualquier profundidad.
 */
export function sanitize(value: unknown): unknown {
  // TODO [Estudiante 4] Paso 2: implementa la limpieza recursiva.
  //   - Si es un array   → return value.map(sanitize)
  //   - Si es un Date    → devuélvelo tal cual (¡un Date también es 'object'!)
  //   - Si es un objeto  → crea un objeto NUEVO recorriendo Object.entries(value):
  //       · clave en REMOVED_FIELDS → no la copies
  //       · clave en MASKED_FIELDS  → copia maskCreditCard(valor)
  //       · cualquier otra clave    → copia sanitize(valor)   (recursión)
  //   - Cualquier otro valor (string, number, null...) → devuélvelo tal cual
  //
  // ⚠️ NO modifiques (mutes) el objeto original con `delete`: es la misma
  //   referencia que guarda el servicio en memoria y perderías los datos
  //   reales. Los tests lo verifican.

  // ⬇️ Reemplaza esta línea por tu implementación.
  return value;
}

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // TODO [Estudiante 4] Paso 3: aplica sanitize() a cada respuesta:
    //   next.handle().pipe( map((data) => sanitize(data)) )

    // ⬇️ Reemplaza esta línea por tu implementación.
    return next.handle();
  }
}
