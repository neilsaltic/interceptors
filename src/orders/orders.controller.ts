import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrdersService } from './orders.service.js';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiRequestTimeoutResponse } from '@nestjs/swagger';
import { Order } from './entities/order.entity.js';

// =============================================================================
// OrdersController
// -----------------------------------------------------------------------------
// El CRUD ya funciona. Aquí solo hay que agregar decoradores de Swagger
// (todos se importan desde '@nestjs/swagger').
//
// TODO [Estudiante 3 - Swagger]: describe QUÉ puede responder cada endpoint.
//   - @ApiOkResponse({ type: Order }) / @ApiOkResponse({ type: [Order] })
//   - @ApiCreatedResponse({ type: Order }) en POST
//   - @ApiBadRequestResponse(...) en POST (falla la validación del DTO)
//   - @ApiNotFoundResponse(...) en GET /orders/:id
//   - @ApiRequestTimeoutResponse(...) en el reporte pesado (¡lo lanza tu interceptor!)
//
// Coordinen entre ustedes: ambos editan este archivo (hagan commits pequeños).
// =============================================================================

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar pedidos',
    description: 'Devuelve todos los pedidos registrados en memoria.',
  })
  @ApiOkResponse({ type: Order, description: 'Ordenes mostradas con exito' })
  findAll() {
    return this.ordersService.findAll();
  }

  // Esta ruta se declara ANTES de ':id' para que se lea de lo más específico
  // a lo más genérico.
  @Get('reports/heavy-process')
  @ApiOperation({
    summary: 'Generar reporte de pedidos',
    description:
      'Ejecuta un reporte que simula un procesamiento de aproximadamente 4.5 segundos.',
  })
  @ApiOkResponse({ description: 'Reportes mostrados con exito'})
  @ApiRequestTimeoutResponse({ description: 'Excedido el tiempo limite para mostrar los reportes'})
  generateHeavyReport() {
    return this.ordersService.generateHeavyReport();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar un pedido',
    description: 'Devuelve el detalle de un pedido a partir de su identificador.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador numérico del pedido que se desea consultar.',
    example: 1,
  })
  @ApiOkResponse({ type: Order, description: 'Orden ID mostrada con exito'})
  @ApiNotFoundResponse({ description: 'No se encontro la orden'})
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un pedido',
    description:
      'Crea un pedido con los datos del cliente, los productos y la tarjeta enviados en el cuerpo de la petición.',
  })
  @ApiCreatedResponse({ type: Order, description: 'Orden creada con exito'})
  @ApiBadRequestResponse({ description: ' Fallo al crear la orden, use el formato valido'})
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}
