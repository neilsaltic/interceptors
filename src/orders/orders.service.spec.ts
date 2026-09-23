import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service.js';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(() => {
    service = new OrdersService();
  });

  it('lista los pedidos iniciales', () => {
    expect(service.findAll()).toHaveLength(3);
  });

  it('lanza NotFoundException si el pedido no existe', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });

  it('crea un pedido calculando el total', () => {
    const order = service.create({
      customerName: 'Test',
      customerEmail: 'test@example.com',
      items: [{ productId: 1, productName: 'X', quantity: 3, unitPrice: 10.5 }],
      creditCard: '4242424242424242',
    });

    expect(order.id).toBe(4);
    expect(order.total).toBe(31.5);
    expect(service.findAll()).toHaveLength(4);
  });
});
