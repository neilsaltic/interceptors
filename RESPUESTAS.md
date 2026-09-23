Pregunta 3. Logging: ¿por qué con tap(() => ...) las peticiones que fallan no se loguean? ¿Qué alternativa ofrece tap({ next, error }) o finalize()?
Respuesta.- si usamos solo tap(()=>...) entonces las peticiones que fallan no se muestran es por eso que existe tap({next, error}) en este codigo en el apartado de next se ejecuta si todo lo que pasa por el interceptor esta bien osea tiene exito, pero si ocurre un error entonces se va al apartado error, y se ejecuta el error mostrando detalles, y ahora tambien existe un apartado que es finalize(), pero ese se ejecuta si o si .. osea no le importa si es exitosa o erronea la peticion ... si o si se ejecuta y en el proyecto actual no es algo correcto por que necesitamos saber si o si si el proceso es exitoso o erroneo
-------------------------------------------------------------------------------------------

Estudiante 4 Cristian Claudio

1. Pregunta: ¿Qué pasaría si SanitizeInterceptor se registrara antes que TransformInterceptor? ¿Seguiría limpiando los datos?
Sí, seguiría limpiando los datos siempre y cuando la función de sanitización sea recursiva, ya que recorrería el objeto envuelto y limpiaría las propiedades sensibles dentro de data.

2. Pregunta: Ocultar datos con un interceptor es una red de seguridad. ¿Qué otra estrategia existe? ¿Cuál preferirían en producción y por qué?
La otra estrategia es usar el ClassSerializerInterceptor global de NestJS junto con los decoradores @Exclude() y @Expose() de la librería class-transformer directamente en la entidad o en un DTO de salida dedicado.
Preferencia en producción: Se prefiere ampliamente ClassSerializerInterceptor. ¿Por qué? Porque es declarativo y vive junto a la definición del modelo. Es mucho más seguro y fácil de auditar, ya que evita la fragilidad de mantener listas manuales de strings (como REMOVED_FIELDS), reduce el riesgo de errores humanos al agregar nuevos campos sensibles y escala mejor en aplicaciones grandes con múltiples modelos.

3. Documentación real en Swagger 
Pregunta: La documentación dice que GET /orders/1 devuelve un Order, pero en realidad el cliente recibe { statusCode, timestamp, path, data: Order }. ¿Cómo lo documentarían bien?
Para documentarlo correctamente, se debe crear una clase genérica de respuesta (ej. ApiResponseDto<T>) que refleje la estructura real del wrapper. Luego, en el controlador, se puede usar un decorador personalizado (como sugiere el reto bonus: @ApiWrappedResponse(Order)) que utilice ApiExtraModels(Order) y getSchemaPath(Order) de @nestjs/swagger. Esto le indica a Swagger que genere el esquema anidado correctamente, mostrando en la UI el ejemplo real con statusCode, timestamp, path y el objeto data con el modelo Order dentro.