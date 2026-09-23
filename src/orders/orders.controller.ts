import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrdersService } from './orders.service.js';

// =============================================================================
// OrdersController
// -----------------------------------------------------------------------------
// El CRUD ya funciona. Aquí solo hay que agregar decoradores de Swagger
// (todos se importan desde '@nestjs/swagger').
//
// TODO [Estudiante 1 - Swagger]: describe QUÉ hace cada endpoint.
//   - @ApiTags('orders') sobre la clase, para agruparlos en Swagger UI.
//   - @ApiOperation({ summary: '...', description: '...' }) en cada método.
//   - @ApiParam({ name: 'id', description: '...', example: 1 }) en GET /orders/:id.
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

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // Esta ruta se declara ANTES de ':id' para que se lea de lo más específico
  // a lo más genérico.
  @Get('reports/heavy-process')
  generateHeavyReport() {
    return this.ordersService.generateHeavyReport();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}
