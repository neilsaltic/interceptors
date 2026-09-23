# 🛒 Orders & Products API — Taller de Interceptores y Swagger en NestJS

Proyecto base para una práctica de **3 horas** en equipos de **4 estudiantes**.

La API ya funciona: tiene un CRUD de pedidos en memoria, con validaciones y una base de Swagger. **Su misión es completar 4 interceptores y documentar la API con Swagger/OpenAPI.**

---

## 📋 Consigna del grupo

### El escenario

Su equipo acaba de heredar la API de pedidos de una tienda online. Funciona, pero antes de salir a producción el Tech Lead encontró **4 problemas**:

1. 🔴 **Expone datos sensibles.** `GET /orders/1` devuelve el hash de la contraseña del cliente, el número completo de su tarjeta y el secreto de la pasarela de pagos.
2. 🟠 **Las respuestas no tienen un formato estándar.** El equipo de frontend pide que todas vengan con la misma estructura.
3. 🟠 **Hay un endpoint que deja al cliente esperando.** El reporte pesado tarda casi 5 segundos y nadie lo corta.
4. 🟡 **No hay forma de saber qué pasa.** No se registran las peticiones ni cuánto tardan.

Además, **la API no tiene documentación**: nadie de fuera del equipo sabe cómo usarla.

### Lo que deben hacer

Resolver los 4 problemas con **interceptores de NestJS** y dejar la API **documentada con Swagger**, sin tocar la lógica del CRUD (`orders.service.ts`).

El grupo tiene **4 integrantes**. Cada uno se encarga de **un interceptor y de una parte de la documentación**:

| Integrante | Interceptor | Problema que resuelve | Parte de Swagger |
|---|---|---|---|
| **Estudiante 1** | `TransformInterceptor` | Formato estándar de respuesta | Tags, resúmenes y parámetros de cada endpoint |
| **Estudiante 2** | `LoggingInterceptor` | Registro de peticiones y tiempos | Ficha general de la API (título, descripción, versión) |
| **Estudiante 3** | `TimeoutInterceptor` | Cortar peticiones de más de 3 s | Respuestas posibles de cada endpoint (200, 201, 400, 404, 408) |
| **Estudiante 4** | `SanitizeInterceptor` | Ocultar y enmascarar datos sensibles | Modelos (DTOs y entidad) con ejemplos, sin campos sensibles |

El detalle de cada tarea está en la [sección 4](#-4-el-reto-asignación-por-integrante) y en los comentarios `TODO [Estudiante N]` del código.

### Cómo trabajar en GitHub

1. **Un integrante** crea el repositorio del grupo con el botón **"Use this template"** → *Create a new repository*.
2. Invita a los otros 3 como colaboradores (*Settings → Collaborators*).
3. Cada integrante clona el repositorio y crea **su propia rama**:
   ```bash
   git checkout -b estudiante-1-transform    # ejemplo
   ```
4. Cada uno trabaja en su rama y la sube con `git push -u origin <su-rama>`.
5. Cada integrante abre un **Pull Request** hacia `main`. **Otro compañero lo revisa y lo aprueba** antes de hacer merge.
6. Con los 4 PR unidos en `main`, el grupo corre los tests y revisa Swagger UI **todos juntos**.

> 💡 Los estudiantes 1 y 3 editan el mismo archivo (`orders.controller.ts`). Hagan merge de uno primero y que el otro actualice su rama con `git pull origin main` antes de su PR.

### Reglas

- ❌ No modificar `test/orders.e2e-spec.ts` ni `src/orders/orders.service.ts`.
- ❌ No usar `console.log` en el `LoggingInterceptor`: usen el `Logger` de Nest.
- ✅ Cada integrante debe poder **explicar su interceptor** en la demo final: qué operador de RxJS usó y por qué.
- ✅ Se puede (y se recomienda) ayudarse entre compañeros, pero cada uno hace los commits de su parte.

### ¿Cuándo terminan?

El trabajo está completo cuando se cumple **todo** esto:

- [ ] `npm run test:e2e` pasa **26/26** en la rama `main`.
- [ ] Swagger UI (`/docs`) muestra la API documentada y **sin** `passwordHash` ni `clientSecret` en ningún lado.
- [ ] Hay **4 Pull Requests unidos**, uno por integrante, cada uno aprobado por otro compañero.
- [ ] Existe un archivo `RESPUESTAS.md` en la raíz con las respuestas del grupo a las [preguntas para pensar](#-7-preguntas-para-pensar-cierre-de-clase).

### Entregables

Suban al aula virtual:

1. El **link del repositorio** del grupo.
2. Una **captura de pantalla** de la terminal con los tests en verde (26/26).
3. Una **captura de Swagger UI** con los endpoints desplegados.

### Evaluación

| Criterio | Peso |
|---|---|
| Interceptores funcionando (tests de interceptores en verde) | 40 % |
| Documentación Swagger completa (tests de Swagger en verde + revisión en `/docs`) | 25 % |
| Código limpio y legible (sin `TODO` pendientes, sin código comentado sobrante) | 15 % |
| Trabajo en equipo en GitHub (ramas, PRs, revisiones) | 10 % |
| `RESPUESTAS.md`: respuestas a las preguntas para pensar | 10 % |

---

## 📦 1. Instalación y ejecución

**Requisitos:** Node.js 20 o superior (recomendado: 22 o 24) y npm.

```bash
npm install          # instala dependencias
npm run start:dev    # levanta el servidor en modo watch (se recarga al guardar)
```

| Recurso | URL |
|---|---|
| API | http://localhost:3000/orders |
| Swagger UI | http://localhost:3000/docs |
| OpenAPI JSON | http://localhost:3000/docs-json |

Para cambiar el puerto: `PORT=4000 npm run start:dev` (en PowerShell: `$env:PORT=4000; npm run start:dev`).

### Scripts útiles

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Servidor con recarga automática |
| `npm run test:e2e` | **Tests de aceptación del taller** (ver sección 5) |
| `npm run test:e2e -- -t "Estudiante 3"` | Solo los tests de un integrante |
| `npm test` | Tests unitarios del servicio |
| `npm run build` | Compila a `dist/` |

> ℹ️ Los datos viven en un array dentro de `OrdersService`. Cada vez que el servidor se reinicia, vuelven al estado inicial (3 pedidos). No hay base de datos, Docker ni migraciones.

---

## 🗂️ 2. Estructura del proyecto

```
src/
├── main.ts                          # Arranque del servidor
├── app.setup.ts                     # ⭐ Pipes, interceptores globales y Swagger (Estudiante 2 edita Swagger aquí)
├── app.module.ts
├── common/
│   ├── interfaces/
│   │   └── api-response.interface.ts
│   └── interceptors/                # ⭐ AQUÍ ESTÁN LOS RETOS
│       ├── transform.interceptor.ts   → Estudiante 1
│       ├── logging.interceptor.ts     → Estudiante 2
│       ├── timeout.interceptor.ts     → Estudiante 3
│       └── sanitize.interceptor.ts    → Estudiante 4
└── orders/
    ├── orders.module.ts
    ├── orders.controller.ts         # ⭐ Estudiantes 1 y 3 documentan con Swagger
    ├── orders.service.ts            # "Base de datos" en memoria (no hace falta tocarlo)
    ├── dto/create-order.dto.ts      # ⭐ Estudiante 4 documenta con Swagger
    └── entities/order.entity.ts     # ⭐ Estudiante 4 documenta con Swagger
test/
└── orders.e2e-spec.ts               # Tests de aceptación (¡no modificar!)
```

Busquen `TODO [Estudiante N]` en el código: cada TODO explica el paso a paso.

### Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/orders` | Lista todos los pedidos |
| `GET` | `/orders/:id` | Detalle de un pedido (**incluye datos sensibles**: `passwordHash`, `creditCard`, `clientSecret`) |
| `POST` | `/orders` | Crea un pedido (validado con `class-validator`) |
| `GET` | `/orders/reports/heavy-process` | Reporte "pesado" que tarda **~4.5 s** (a propósito) |

---

## 🧠 3. Conceptos clave (lean esto antes de empezar)

Un **interceptor** es una clase que envuelve la ejecución de un endpoint. Puede ejecutar código **antes** del controller y, gracias a RxJS, **transformar o reaccionar a la respuesta después**.

```ts
@Injectable()
export class EjemploInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // 1) Código ANTES del controller
    return next.handle().pipe(
      // 2) Operadores RxJS que actúan DESPUÉS, sobre la respuesta
    );
  }
}
```

| Operador RxJS | Para qué sirve | ¿Lo usa? |
|---|---|---|
| `map(fn)` | Transforma el valor de la respuesta | Transform, Sanitize |
| `tap(fn)` | Efecto secundario sin modificar la respuesta | Logging |
| `timeout(ms)` | Lanza `TimeoutError` si no hay respuesta a tiempo | Timeout |
| `catchError(fn)` | Atrapa un error y decide qué hacer con él | Timeout |

Los 4 interceptores **ya están registrados globalmente** en `src/app.setup.ts`, en este orden:

```
petición  ─►  Logging ─► Timeout ─► Transform ─► Sanitize ─► Controller
respuesta ◄─  Logging ◄─ Timeout ◄─ Transform ◄─ Sanitize ◄─┘
```

Por ahora solo hacen `return next.handle()` (dejan pasar todo). Cada integrante reemplaza esa línea por su implementación. Así pueden trabajar **en paralelo** sin romper la app.

---

## 🎯 4. El reto: asignación por integrante

Cada integrante implementa **1 interceptor + 1 parte de la documentación Swagger**.

### 👤 Estudiante 1 — `TransformInterceptor` + Swagger de operaciones

**Interceptor** (`src/common/interceptors/transform.interceptor.ts`)
Envolver toda respuesta exitosa en un formato estándar usando `map()`:

```json
{ "statusCode": 200, "timestamp": "2026-09-23T14:00:00.000Z", "path": "/orders", "data": [ ... ] }
```

**Swagger** (`src/orders/orders.controller.ts`)
- `@ApiTags('orders')` en el controller.
- `@ApiOperation({ summary, description })` en los 4 endpoints.
- `@ApiParam({ name: 'id', description, example })` en `GET /orders/:id`.

### 👤 Estudiante 2 — `LoggingInterceptor` + Swagger `DocumentBuilder`

**Interceptor** (`src/common/interceptors/logging.interceptor.ts`)
Medir el tiempo de cada petición y loguear `MÉTODO URL XXms` con el `Logger` de Nest usando `tap()`. También las que fallan.

```
LOG   [HTTP] GET /orders 3ms
ERROR [HTTP] GET /orders/999 1ms - Order #999 no existe
```

**Swagger** (`src/app.setup.ts`)
Completar el `DocumentBuilder`: título, descripción, versión, tag `orders` con descripción y contacto.

### 👤 Estudiante 3 — `TimeoutInterceptor` + Swagger de respuestas

**Interceptor** (`src/common/interceptors/timeout.interceptor.ts`)
Cortar cualquier petición que tarde más de **3 segundos** y responder `408` con `timeout()` + `catchError()` + `RequestTimeoutException`. Los demás errores (404, 400) deben pasar **sin cambios**.

**Swagger** (`src/orders/orders.controller.ts`)
Documentar qué puede responder cada endpoint:
- `@ApiOkResponse({ type: Order })` / `@ApiOkResponse({ type: [Order] })`
- `@ApiCreatedResponse({ type: Order })` y `@ApiBadRequestResponse()` en `POST`
- `@ApiNotFoundResponse()` en `GET /orders/:id`
- `@ApiRequestTimeoutResponse()` en el reporte pesado

### 👤 Estudiante 4 — `SanitizeInterceptor` + Swagger de modelos

**Interceptor** (`src/common/interceptors/sanitize.interceptor.ts`)
Limpiar la respuesta con `map()` antes de enviarla:
- Eliminar `passwordHash` y `clientSecret`.
- Enmascarar `creditCard` → `**** **** **** 4242`.
- Debe funcionar con objetos, arrays y objetos anidados, **sin mutar** los datos originales del servicio.

**Swagger** (`src/orders/dto/create-order.dto.ts` y `src/orders/entities/order.entity.ts`)
- `@ApiProperty({ description, example })` en todos los campos del DTO y de la entidad.
- `@ApiHideProperty()` en `passwordHash` y `clientSecret`: no deben aparecer en la documentación.

### 🤝 Coordinación del equipo

- Estudiantes **1 y 3** editan el mismo archivo (`orders.controller.ts`). Pónganse de acuerdo: uno agrega sus decoradores primero, o trabajen en ramas y hagan merge.
- El schema `Order` solo aparece en Swagger cuando alguien lo usa en una respuesta. El test "el modelo Order existe" del **Estudiante 4** pasa cuando el **Estudiante 3** agregó `@ApiOkResponse({ type: Order })`.
- Al final, **todo el equipo** revisa junto la app en Swagger UI (sección 6).

### ⏱️ Agenda sugerida (3 h)

| Tiempo | Actividad |
|---|---|
| 0:00 – 0:20 | Instalación, recorrido del código, lectura de la sección 3 |
| 0:20 – 1:30 | Cada integrante implementa **su interceptor** |
| 1:30 – 1:40 | Pausa |
| 1:40 – 2:20 | Cada integrante hace **su parte de Swagger** |
| 2:20 – 2:45 | Integración: `npm run test:e2e` en verde (26/26) |
| 2:45 – 3:00 | Demo en Swagger UI + preguntas para pensar |

---

## ✅ 5. Criterios de aceptación

El equipo termina cuando **`npm run test:e2e` pasa completo (26/26)**. Al empezar, solo pasan los 9 de "CRUD base".

```bash
npm run test:e2e                          # todos
npm run test:e2e -- -t "Estudiante 1"     # solo los tuyos
```

| Integrante | Debe cumplir |
|---|---|
| **Estudiante 1** | Respuesta envuelta en `{ statusCode, timestamp, path, data }` · `statusCode` real (201 en POST) · errores **no** envueltos · todas las operaciones con tag `orders` y `summary` · parámetro `id` documentado |
| **Estudiante 2** | Log `MÉTODO URL XXms` con `Logger` de Nest · también loguea los errores · Swagger con título, descripción, versión y tag `orders` descrito |
| **Estudiante 3** | Reporte pesado responde `408` entre 3 y 4 s · un 404 sigue siendo 404 · respuestas 200/201/400/404/408 documentadas con el modelo `Order` |
| **Estudiante 4** | Sin `passwordHash` ni `clientSecret` en ninguna respuesta · tarjeta enmascarada · `createdAt` se conserva como fecha · datos originales **no** mutados · DTOs con `example` · ningún campo sensible en los schemas de Swagger |

---

## 🧪 6. Respuestas esperadas (cURL)

> En PowerShell usen `curl.exe` en lugar de `curl`. También pueden probar todo desde **Swagger UI → "Try it out"** o importar `http://localhost:3000/docs-json` en Postman (*Import → Link*).

### `GET /orders/1` — Transform + Sanitize

```bash
curl http://localhost:3000/orders/1
```

❌ **Antes** (datos crudos y sensibles expuestos):

```json
{
  "id": 1,
  "customer": { "name": "Ana Pérez", "email": "ana.perez@example.com", "passwordHash": "$2b$10$N9qo8u..." },
  "payment": { "creditCard": "4111111111114242", "clientSecret": "pi_3OqX8f2eZvKYlo2C_secret_a1b2c3d4e5" },
  "...": "..."
}
```

✅ **Después**:

```json
{
  "statusCode": 200,
  "timestamp": "2026-09-23T18:55:15.331Z",
  "path": "/orders/1",
  "data": {
    "id": 1,
    "customer": { "name": "Ana Pérez", "email": "ana.perez@example.com" },
    "items": [
      { "productId": 101, "productName": "Teclado mecánico", "quantity": 1, "unitPrice": 89.9 },
      { "productId": 205, "productName": "Mouse inalámbrico", "quantity": 2, "unitPrice": 25 }
    ],
    "total": 139.9,
    "status": "PAID",
    "payment": { "creditCard": "**** **** **** 4242" },
    "createdAt": "2026-09-01T10:15:00.000Z"
  }
}
```

### `POST /orders` — pedido válido → `201`

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Carla Díaz",
    "customerEmail": "carla@example.com",
    "items": [{ "productId": 101, "productName": "Teclado mecánico", "quantity": 2, "unitPrice": 50 }],
    "creditCard": "4242424242421234"
  }'
```

```json
{
  "statusCode": 201,
  "timestamp": "2026-09-23T18:56:02.120Z",
  "path": "/orders",
  "data": {
    "id": 4,
    "customer": { "name": "Carla Díaz", "email": "carla@example.com" },
    "items": [{ "productId": 101, "productName": "Teclado mecánico", "quantity": 2, "unitPrice": 50 }],
    "total": 100,
    "status": "PENDING",
    "payment": { "creditCard": "**** **** **** 1234" },
    "createdAt": "2026-09-23T18:56:02.119Z"
  }
}
```

### `POST /orders` — pedido inválido → `400` (ya funciona, lo hace el `ValidationPipe`)

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Carla","customerEmail":"mal","items":[],"creditCard":"123"}'
```

```json
{
  "message": [
    "customerEmail must be an email",
    "items must contain at least 1 elements",
    "creditCard debe tener exactamente 16 dígitos numéricos"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### `GET /orders/reports/heavy-process` — Timeout → `408` a los ~3 s

```bash
curl -w "\n[HTTP %{http_code} en %{time_total}s]\n" http://localhost:3000/orders/reports/heavy-process
```

```
{"message":"La petición excedió el tiempo límite de 3000 ms","error":"Request Timeout","statusCode":408}
[HTTP 408 en 3.004s]
```

Sin el interceptor, responde `200` después de ~4.5 s.

### `GET /orders/999` → `404` (no se envuelve, no se convierte en 408)

```json
{ "message": "Order #999 no existe", "error": "Not Found", "statusCode": 404 }
```

### Consola del servidor — Logging

```
LOG   [HTTP] GET /orders 4ms
LOG   [HTTP] GET /orders/1 2ms
ERROR [HTTP] POST /orders 10ms - Bad Request Exception
ERROR [HTTP] GET /orders/reports/heavy-process 3001ms - La petición excedió el tiempo límite de 3000 ms
ERROR [HTTP] GET /orders/999 0ms - Order #999 no existe
```

### Swagger UI — `http://localhost:3000/docs`

Al terminar, deberían ver:
- El título, la descripción y la versión de la API arriba.
- Los 4 endpoints agrupados bajo **orders**, cada uno con su resumen.
- En `POST /orders`, un **body de ejemplo** listo para "Try it out".
- En cada endpoint, las respuestas posibles (200/201/400/404/408).
- En **Schemas**: `CreateOrderDto`, `OrderItemDto`, `Order`… y **ningún** `passwordHash` ni `clientSecret`.

---

## 💬 7. Preguntas para pensar (cierre de clase)

1. **Orden:** ¿qué pasaría si `SanitizeInterceptor` se registrara **antes** que `TransformInterceptor`? ¿Seguiría limpiando los datos?
2. **Timeout:** cuando se dispara el 408, ¿el `setTimeout` de 4.5 s del servicio se cancela de verdad, o solo dejamos de esperarlo? ¿Qué implicaría eso con una consulta real a una base de datos?
3. **Logging:** ¿por qué con `tap(() => ...)` las peticiones que fallan no se loguean? ¿Qué alternativa ofrece `tap({ next, error })` o `finalize()`?
4. **Sanitize vs. DTOs de salida:** ocultar datos con un interceptor es una red de seguridad. ¿Qué otra estrategia existe (pista: `class-transformer` con `@Exclude()` y `ClassSerializerInterceptor`)? ¿Cuál preferirían en producción y por qué?
5. **Swagger:** la documentación dice que `GET /orders/1` devuelve un `Order`, pero en realidad el cliente recibe `{ statusCode, timestamp, path, data: Order }`. ¿Cómo lo documentarían bien?

---

## 🚀 8. Retos bonus (para quien termine antes)

- **Timeout por ruta:** aplicar `@UseInterceptors(new TimeoutInterceptor(6000))` solo al reporte pesado. ¿Gana el global (3 s) o el de la ruta (6 s)? ¿Por qué?
- **Documentar el envoltorio real:** crear un decorador `@ApiWrappedResponse(Order)` con `ApiExtraModels` + `getSchemaPath` que documente `{ statusCode, timestamp, path, data }` (responde la pregunta 5).
- **Request ID:** un quinto interceptor que agregue el header `X-Request-Id` a cada respuesta y lo incluya en los logs.
- **Tipado estricto:** que `SanitizeInterceptor` lea los campos sensibles desde un decorador personalizado (`@Sensitive()`) en lugar de una lista fija.

---

## 🛠️ Problemas comunes

| Síntoma | Causa probable |
|---|---|
| `Cannot find module './algo'` | En este proyecto (ESM) los imports locales terminan en `.js`: `import { X } from './x.js'` |
| El linter marca imports sin usar en los interceptores | Son las pistas de la plantilla. Desaparece al implementar el TODO |
| `createdAt` sale como `{}` | En `sanitize()` un `Date` es `typeof 'object'`: devuélvanlo tal cual antes de recorrerlo |
| Falla "NO muta los datos originales" | Usaron `delete obj.x` u `obj.x = ...` sobre el objeto del servicio. Creen un objeto **nuevo** |
| El 404 se convirtió en 408 | En `catchError` están transformando **todos** los errores, no solo `TimeoutError` |
| Puerto 3000 ocupado | `PORT=4000 npm run start:dev` |
