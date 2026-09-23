// =============================================================================
// Entidad Order (en memoria)
// -----------------------------------------------------------------------------
// Se usan CLASES (no interfaces) a propósito: Swagger solo puede leer los
// decoradores @ApiProperty() de una clase; las interfaces desaparecen al
// compilar a JavaScript.
//
// ⚠️ Esta entidad contiene campos SENSIBLES (passwordHash, creditCard,
// clientSecret). El servicio los devuelve "tal cual" a propósito: es trabajo
// del SanitizeInterceptor limpiarlos antes de que lleguen al cliente.
//
// TODO [Estudiante 4 - Swagger]: documenta cada propiedad con @ApiProperty()
//   (description + example). Importa desde '@nestjs/swagger'.
//   - En `creditCard` usa como example el valor YA ENMASCARADO
//     ('**** **** **** 4242'), porque es lo que verá el cliente.
//   - NO documentes `passwordHash` ni `clientSecret`: el cliente nunca los
//     recibe, así que no deben aparecer en el contrato público. Puedes usar
//     @ApiHideProperty() para dejarlo explícito.
//   - En `status` usa `enum: OrderStatus`.
// =============================================================================

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class Customer {
  name: string;
  email: string;
  /** Hash de la contraseña del cliente. NUNCA debe salir de la API. */
  passwordHash: string;
}

export class OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export class PaymentInfo {
  /** Número completo de tarjeta. Debe enmascararse: '**** **** **** 4242'. */
  creditCard: string;
  /** Secreto de la pasarela de pagos. NUNCA debe salir de la API. */
  clientSecret: string;
}

export class Order {
  id: number;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  payment: PaymentInfo;
  createdAt: Date;
}
