/**
 * Formato estándar de TODAS las respuestas exitosas de la API.
 * Lo construye el TransformInterceptor.
 */
export interface ApiResponse<T> {
  statusCode: number;
  timestamp: string;
  path: string;
  data: T;
}
