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

// =============================================================================
// DTOs de entrada para POST /orders
// -----------------------------------------------------------------------------
// Las validaciones (class-validator) YA están hechas: si el body no cumple,
// el ValidationPipe global responde 400 automáticamente.
//
// TODO [Estudiante 4 - Swagger]: agrega @ApiProperty() a cada campo con
//   `description` y `example`, para que Swagger UI muestre un body de ejemplo
//   listo para probar con "Try it out".
//   - En `items` indica el tipo del array: @ApiProperty({ type: [OrderItemDto] })
//   - Aprovecha opciones como `minimum`, `minItems` o `pattern` para que la
//     documentación refleje las mismas reglas que las validaciones.
// =============================================================================

export class OrderItemDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsPositive()
  unitPrice: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @Matches(/^\d{16}$/, {
    message: 'creditCard debe tener exactamente 16 dígitos numéricos',
  })
  creditCard: string;
}
