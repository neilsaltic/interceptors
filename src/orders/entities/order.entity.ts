import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class Customer {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Ana Pérez' })
  name: string;

  @ApiProperty({ description: 'Correo electrónico del cliente', example: 'ana.perez@example.com' })
  email: string;

  @ApiHideProperty()
  passwordHash: string;
}

export class OrderItem {
  @ApiProperty({ description: 'ID del producto', example: 101 })
  productId: number;

  @ApiProperty({ description: 'Nombre del producto', example: 'Teclado mecánico' })
  productName: string;

  @ApiProperty({ description: 'Cantidad de unidades', example: 2 })
  quantity: number;

  @ApiProperty({ description: 'Precio unitario', example: 89.9 })
  unitPrice: number;
}

export class PaymentInfo {
  @ApiProperty({ description: 'Número de tarjeta enmascarado', example: '**** **** **** 4242' })
  creditCard: string;

  @ApiHideProperty()
  clientSecret: string;
}

export class Order {
  @ApiProperty({ description: 'ID único del pedido', example: 1 })
  id: number;

  @ApiProperty({ description: 'Datos del cliente', type: () => Customer })
  customer: Customer;

  @ApiProperty({ description: 'Productos del pedido', type: () => [OrderItem] })
  items: OrderItem[];

  @ApiProperty({ description: 'Monto total del pedido', example: 139.9 })
  total: number;

  @ApiProperty({ description: 'Estado actual del pedido', enum: OrderStatus, example: OrderStatus.PAID })
  status: OrderStatus;

  @ApiProperty({ description: 'Información de pago (sanitizada)', type: () => PaymentInfo })
  payment: PaymentInfo;

  @ApiProperty({ description: 'Fecha de creación del pedido', example: '2026-09-23T18:55:15.331Z' })
  createdAt: Date;
}