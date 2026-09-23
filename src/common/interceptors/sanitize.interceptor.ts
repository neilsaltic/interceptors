import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export const REMOVED_FIELDS = ['passwordHash', 'clientSecret'];
export const MASKED_FIELDS = ['creditCard'];

export function maskCreditCard(value: string): string {
  return `**** **** **** ${value.slice(-4)}`;
}

export function sanitize(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    
    for (const [key, val] of Object.entries(value)) {
      if (REMOVED_FIELDS.includes(key)) {
        // No lo copiamos (se elimina)
        continue;
      }
      
      if (MASKED_FIELDS.includes(key)) {
        result[key] = maskCreditCard(val as string);
      } else {
        result[key] = sanitize(val);
      }
    }
    
    return result;
  }
  return value;
}
@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => sanitize(data)));
  }
}