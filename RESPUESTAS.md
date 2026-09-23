Pregunta 3. Logging: ¿por qué con tap(() => ...) las peticiones que fallan no se loguean? ¿Qué alternativa ofrece tap({ next, error }) o finalize()?
Respuesta.- si usamos solo tap(()=>...) entonces las peticiones que fallan no se muestran es por eso que existe tap({next, error}) en este codigo en el apartado de next se ejecuta si todo lo que pasa por el interceptor esta bien osea tiene exito, pero si ocurre un error entonces se va al apartado error, y se ejecuta el error mostrando detalles, y ahora tambien existe un apartado que es finalize(), pero ese se ejecuta si o si .. osea no le importa si es exitosa o erronea la peticion ... si o si se ejecuta y en el proyecto actual no es algo correcto por que necesitamos saber si o si si el proceso es exitoso o erroneo

## Pregunta 5. Swagger — Estudiante 1

La documentación dice que GET /orders/1 devuelve un Order, pero en realidad el cliente recibe { statusCode, timestamp, path, data: Order }. ¿Cómo lo documentarían bien?

**Respuesta:** Yo documentaría la respuesta completa, porque mi interceptor no devuelve el pedido solo, sino que lo coloca dentro de data y agrega statusCode, timestamp y path. Entonces, en Swagger deberían aparecer esos cuatro campos para que quien use la API sepa qué va a recibir.

En data pondría el modelo Order cuando se consulta un pedido por su id. Para GET /orders pondría un arreglo de Order, porque devuelve varios pedidos. También indicaría que statusCode es un número, timestamp es una fecha en formato de texto y path es la ruta de la petición.

Para no repetir esta documentación en cada endpoint, se podría crear un decorador llamado @ApiWrappedResponse(Order), usando ApiExtraModels para registrar el modelo y getSchemaPath para referenciarlo dentro de data. Los errores se documentarían aparte, porque mi interceptor no los envuelve. Así la documentación coincidiría con la respuesta real de la API.
