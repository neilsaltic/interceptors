import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { OrdersService } from '../src/orders/orders.service.js';

// =============================================================================
// Tests de aceptación del taller.
//
//   npm run test:e2e                        → todos
//   npm run test:e2e -- -t "Estudiante 1"   → solo los de un integrante
//
// Al empezar, solo pasan los de "CRUD base". Al terminar, deben pasar TODOS.
// No modifiques este archivo para hacerlos pasar 😉
// =============================================================================

const validOrder = {
  customerName: 'Carla Test',
  customerEmail: 'carla@example.com',
  items: [
    {
      productId: 101,
      productName: 'Teclado mecánico',
      quantity: 2,
      unitPrice: 50,
    },
  ],
  creditCard: '4242424242421234',
};

/** Devuelve `data` si la respuesta ya viene envuelta por Transform. */
const payload = (body: any) => (body && 'data' in body ? body.data : body);

describe('Orders API (e2e)', () => {
  let app: INestApplication;
  let http: ReturnType<typeof request>;
  let swagger: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication({ logger: false });
    configureApp(app);
    await app.init();

    http = request(app.getHttpServer());
    swagger = (await http.get('/docs-json')).body;
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  describe('CRUD base (ya funciona)', () => {
    it('GET /orders devuelve los pedidos', async () => {
      const res = await http.get('/orders').expect(200);
      expect(payload(res.body)).toHaveLength(3);
    });

    it('GET /orders/999 → 404', async () => {
      await http.get('/orders/999').expect(404);
    });

    it('GET /orders/abc → 400 (ParseIntPipe)', async () => {
      await http.get('/orders/abc').expect(400);
    });

    it('POST /orders con body inválido → 400', async () => {
      await http
        .post('/orders')
        .send({
          ...validOrder,
          customerEmail: 'no-es-email',
          creditCard: '123',
        })
        .expect(400);
    });

    it('Swagger UI responde en /docs', async () => {
      await http.get('/docs').expect(200);
    });
  });

  // ---------------------------------------------------------------------------
  describe('Estudiante 1 — TransformInterceptor + Swagger (operaciones)', () => {
    it('envuelve GET /orders en { statusCode, timestamp, path, data }', async () => {
      const res = await http.get('/orders').expect(200);

      expect(res.body).toEqual({
        statusCode: 200,
        timestamp: expect.any(String),
        path: '/orders',
        data: expect.any(Array),
      });
      expect(new Date(res.body.timestamp).toISOString()).toBe(
        res.body.timestamp,
      );
    });

    it('usa el status real: POST /orders → statusCode 201', async () => {
      const res = await http.post('/orders').send(validOrder).expect(201);
      expect(res.body.statusCode).toBe(201);
      expect(res.body.path).toBe('/orders');
      expect(res.body.data.id).toEqual(expect.any(Number));
    });

    it('NO envuelve los errores (404 conserva el formato de Nest)', async () => {
      const res = await http.get('/orders/999').expect(404);
      expect(res.body).not.toHaveProperty('data');
      expect(res.body.statusCode).toBe(404);
    });

    it('Swagger: todas las operaciones tienen tag "orders" y summary', () => {
      const operations = Object.values(swagger.paths).flatMap((p: any) =>
        Object.values(p),
      );
      expect(operations.length).toBe(4);
      for (const op of operations as any[]) {
        expect(op.tags).toContain('orders');
        expect(op.summary).toBeTruthy();
      }
    });

    it('Swagger: el parámetro :id está documentado', () => {
      const param = swagger.paths['/orders/{id}'].get.parameters.find(
        (p: any) => p.name === 'id',
      );
      expect(param.description).toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  describe('Estudiante 2 — LoggingInterceptor + Swagger (DocumentBuilder)', () => {
    const logged = (spies: { mock: { calls: unknown[][] } }[]) =>
      spies.flatMap((s) => s.mock.calls.map((args) => String(args[0])));

    it('loguea método, URL y milisegundos con el Logger de Nest', async () => {
      const log = vi
        .spyOn(Logger.prototype, 'log')
        .mockImplementation(() => {});

      await http.get('/orders').expect(200);

      expect(logged([log])).toContainEqual(
        expect.stringMatching(/GET \/orders \d+ ?ms/),
      );
    });

    it('también loguea las peticiones que terminan en error', async () => {
      const spies = (['log', 'warn', 'error'] as const).map((m) =>
        vi.spyOn(Logger.prototype, m).mockImplementation(() => {}),
      );

      await http.get('/orders/999').expect(404);

      expect(logged(spies)).toContainEqual(
        expect.stringMatching(/GET \/orders\/999 \d+ ?ms/),
      );
    });

    it('Swagger: la API tiene título, descripción y versión', () => {
      expect(swagger.info.title).toBeTruthy();
      expect(swagger.info.description).toBeTruthy();
      expect(swagger.info.version).toBeTruthy();
    });

    it('Swagger: el tag "orders" está declarado con descripción', () => {
      const tag = (swagger.tags ?? []).find((t: any) => t.name === 'orders');
      expect(tag?.description).toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  describe('Estudiante 3 — TimeoutInterceptor + Swagger (respuestas)', () => {
    it('corta el reporte pesado a los ~3 s con 408 Request Timeout', async () => {
      const start = Date.now();
      const res = await http.get('/orders/reports/heavy-process').expect(408);
      const elapsed = Date.now() - start;

      expect(res.body.statusCode).toBe(408);
      expect(elapsed).toBeGreaterThanOrEqual(2900);
      expect(elapsed).toBeLessThan(4000);
    }, 10_000);

    it('no convierte otros errores en 408 (404 sigue siendo 404)', async () => {
      await http.get('/orders/999').expect(404);
    });

    it('Swagger: documenta 200 con el modelo Order en GET /orders/:id', () => {
      const ok = swagger.paths['/orders/{id}'].get.responses['200'];
      expect(JSON.stringify(ok)).toContain('#/components/schemas/Order');
    });

    it('Swagger: documenta 201 y 400 en POST /orders', () => {
      const responses = swagger.paths['/orders'].post.responses;
      expect(JSON.stringify(responses['201'])).toContain(
        '#/components/schemas/Order',
      );
      expect(responses['400']).toBeDefined();
    });

    it('Swagger: documenta 404 en GET /orders/:id y 408 en el reporte', () => {
      expect(swagger.paths['/orders/{id}'].get.responses['404']).toBeDefined();
      expect(
        swagger.paths['/orders/reports/heavy-process'].get.responses['408'],
      ).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  describe('Estudiante 4 — SanitizeInterceptor + Swagger (DTOs y entidad)', () => {
    it('GET /orders/:id elimina passwordHash y clientSecret y enmascara la tarjeta', async () => {
      const order = payload((await http.get('/orders/1').expect(200)).body);

      expect(order.customer).not.toHaveProperty('passwordHash');
      expect(order.payment).not.toHaveProperty('clientSecret');
      expect(order.payment.creditCard).toBe('**** **** **** 4242');
      expect(order.customer.name).toBe('Ana Pérez');
    });

    it('funciona también con arrays (GET /orders)', async () => {
      const res = await http.get('/orders').expect(200);

      expect(res.text).not.toContain('passwordHash');
      expect(res.text).not.toContain('clientSecret');
      expect(res.text).not.toContain('4111111111114242');
      expect(payload(res.body)[1].payment.creditCard).toBe(
        '**** **** **** 5678',
      );
    });

    it('funciona también en POST /orders', async () => {
      const res = await http.post('/orders').send(validOrder).expect(201);
      expect(res.text).not.toContain('passwordHash');
      expect(payload(res.body).payment.creditCard).toBe('**** **** **** 1234');
    });

    it('conserva las fechas (createdAt no se convierte en {})', async () => {
      const order = payload((await http.get('/orders/1').expect(200)).body);
      expect(order.createdAt).toBe('2026-09-01T10:15:00.000Z');
    });

    it('NO muta los datos originales del servicio', async () => {
      await http.get('/orders/1').expect(200);

      const original = app.get(OrdersService).findOne(1);
      expect(original.payment.creditCard).toBe('4111111111114242');
      expect(original.customer.passwordHash).toBeDefined();
    });

    it('Swagger: CreateOrderDto documenta todos sus campos con ejemplo', () => {
      const { CreateOrderDto, OrderItemDto } = swagger.components.schemas;
      for (const field of ['customerName', 'customerEmail', 'creditCard']) {
        expect(
          CreateOrderDto?.properties?.[field]?.example,
          field,
        ).toBeDefined();
      }
      expect(CreateOrderDto?.properties?.items?.items?.$ref).toContain(
        'OrderItemDto',
      );
      for (const field of [
        'productId',
        'productName',
        'quantity',
        'unitPrice',
      ]) {
        expect(OrderItemDto?.properties?.[field]?.example, field).toBeDefined();
      }
    });

    it('Swagger: el modelo Order existe y NO expone campos sensibles', () => {
      const schemas = swagger.components.schemas;
      expect(schemas.Order?.properties).toBeDefined();
      expect(JSON.stringify(schemas)).not.toContain('passwordHash');
      expect(JSON.stringify(schemas)).not.toContain('clientSecret');
    });
  });
});
