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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un pedido',
    description:
      'Crea un pedido con los datos del cliente, los productos y la tarjeta enviados en el cuerpo de la petición.',
  })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}
