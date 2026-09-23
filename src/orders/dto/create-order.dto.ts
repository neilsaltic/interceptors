import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ description: 'ID del producto', example: 101 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ description: 'Nombre del producto', example: 'Teclado mecánico' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ description: 'Cantidad de unidades', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Precio unitario', example: 89.9, minimum: 0 })
  @IsPositive()
  unitPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Nombre completo del cliente', example: 'Ana Pérez' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ description: 'Correo electrónico del cliente', example: 'ana.perez@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ 
    description: 'Lista de productos solicitados', 
    type: [OrderItemDto],
    minItems: 1 
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ 
    description: 'Número de tarjeta de crédito (16 dígitos)', 
    example: '4111111111114242',
    pattern: '^\\d{16}$'
  })
  @Matches(/^\d{16}$/, {
    message: 'creditCard debe tener exactamente 16 dígitos numéricos',
  })
  creditCard: string;
}