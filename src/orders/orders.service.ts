import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order, OrderStatus } from './entities/order.entity.js';

// Servicio con "base de datos" en memoria. Al reiniciar el servidor, los
// datos vuelven a este estado inicial. No hace falta modificar este archivo.
@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [
    {
      id: 1,
      customer: {
        name: 'Ana Pérez',
        email: 'ana.perez@example.com',
        passwordHash:
          '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      },
      items: [
        {
          productId: 101,
          productName: 'Teclado mecánico',
          quantity: 1,
          unitPrice: 89.9,
        },
        {
          productId: 205,
          productName: 'Mouse inalámbrico',
          quantity: 2,
          unitPrice: 25,
        },
      ],
      total: 139.9,
      status: OrderStatus.PAID,
      payment: {
        creditCard: '4111111111114242',
        clientSecret: 'pi_3OqX8f2eZvKYlo2C_secret_a1b2c3d4e5',
      },
      createdAt: new Date('2026-09-01T10:15:00.000Z'),
    },
    {
      id: 2,
      customer: {
        name: 'Luis Gómez',
        email: 'luis.gomez@example.com',
        passwordHash:
          '$2b$10$7EqJtq98hPqEX7fNZaFWoOhi5BWX4Z3tO5R2Ka5d/1Dwq6Tn1p7bK',
      },
      items: [
        {
          productId: 330,
          productName: 'Monitor 27"',
          quantity: 1,
          unitPrice: 249.99,
        },
      ],
      total: 249.99,
      status: OrderStatus.SHIPPED,
      payment: {
        creditCard: '5500000000005678',
        clientSecret: 'pi_3OqX9g3fAwLZmp3D_secret_f6g7h8i9j0',
      },
      createdAt: new Date('2026-09-05T16:40:00.000Z'),
    },
    {
      id: 3,
      customer: {
        name: 'María Rojas',
        email: 'maria.rojas@example.com',
        passwordHash:
          '$2b$10$Q3n8V1c2Z9y7X5w4U3t2SeRqPoNmLkJiHgFeDcBa0987654321xyz',
      },
      items: [
        {
          productId: 101,
          productName: 'Teclado mecánico',
          quantity: 3,
          unitPrice: 89.9,
        },
      ],
      total: 269.7,
      status: OrderStatus.PENDING,
      payment: {
        creditCard: '4000056655665556',
        clientSecret: 'pi_3OqY0h4gBxMAnq4E_secret_k1l2m3n4o5',
      },
      createdAt: new Date('2026-09-10T09:05:00.000Z'),
    },
  ];

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Order #${id} no existe`);
    }
    return order;
  }

  create(dto: CreateOrderDto): Order {
    const total = dto.items.reduce(
      (sum, i) => sum + i.quantity * i.unitPrice,
      0,
    );

    const order: Order = {
      id: Math.max(0, ...this.orders.map((o) => o.id)) + 1,
      customer: {
        name: dto.customerName,
        email: dto.customerEmail,
        // Simulamos que el cliente ya tiene una cuenta con contraseña.
        passwordHash: `$2b$10$${randomBytes(22).toString('base64url')}`,
      },
      items: dto.items,
      total: Math.round(total * 100) / 100,
      status: OrderStatus.PENDING,
      payment: {
        creditCard: dto.creditCard,
        clientSecret: `pi_${randomBytes(8).toString('hex')}_secret_${randomBytes(5).toString('hex')}`,
      },
      createdAt: new Date(),
    };

    this.orders.push(order);
    return order;
  }

  /**
   * Simula un reporte pesado (consulta lenta, generación de PDF, etc.).
   * Tarda ~4.5 s a propósito para que el TimeoutInterceptor (3 s) lo corte.
   */
  async generateHeavyReport() {
    await new Promise((resolve) => setTimeout(resolve, 4500));

    return {
      totalOrders: this.orders.length,
      totalRevenue:
        Math.round(this.orders.reduce((sum, o) => sum + o.total, 0) * 100) /
        100,
      generatedAt: new Date(),
    };
  }
}
