# Ficha de Municipio - CRM Comercial Inteligente de Alertatel

## Proposito

La ficha de municipio es la pantalla central para entender y gestionar una cuenta.

No debe ser solo una tarjeta que muestra datos. Debe ayudar al usuario a decidir que hacer con ese municipio: contactar, priorizar, actualizar informacion, crear una oportunidad, registrar una actividad, revisar una senal o descartar una accion.

La ficha debe responder rapidamente:

- Que municipio es.
- Cual es su estado comercial.
- Que relacion tiene con Alertatel.
- Que potencial tiene.
- Que sabemos y que falta saber.
- Que paso recientemente.
- Que hay que hacer despues.

## Objetivo de la ficha

Concentrar en un solo lugar la informacion institucional, comercial y operativa del municipio para que el equipo de Alertatel pueda tomar decisiones con contexto.

La ficha debe servir para:

- evaluar si un municipio requiere accion comercial;
- entender si es cliente, prospecto u oportunidad;
- ver productos contratados o potenciales;
- revisar contactos y responsables;
- conocer el ultimo movimiento comercial;
- definir una proxima accion;
- registrar actividad;
- crear tareas;
- detectar datos faltantes o desactualizados.

## Principio de diseno

La ficha debe priorizar decision y accion.

Los datos deben estar ordenados por utilidad comercial, no por origen del archivo. La informacion mas importante para actuar debe aparecer primero.

Orden recomendado:

1. Estado y proxima accion.
2. Datos comerciales de Alertatel.
3. Contactos y responsable.
4. Actividades recientes.
5. Oportunidades y tareas.
6. Datos institucionales.
7. Datos externos o senales.

## Bloques visuales

## 1. Encabezado de cuenta

Debe identificar rapidamente el municipio.

Contenido:

- nombre del municipio;
- estado comercial;
- prioridad;
- responsable interno;
- seccion electoral;
- provincia;
- indicador visual de cliente, prospecto, oportunidad o descartado.

Debe permitir ver en segundos si la cuenta necesita atencion.

## 2. Resumen comercial

Bloque orientado a decision.

Contenido:

- estado comercial;
- cantidad de botones;
- monto que paga;
- potencial estimado;
- sistema actual;
- fecha de inicio, si es cliente;
- ultima actividad;
- proxima accion;
- fecha de proxima accion;
- oportunidad activa, si existe.

Preguntas que debe responder:

- Es cliente actual?
- Cuanto representa o podria representar?
- Hay una oportunidad abierta?
- Esta abandonado el seguimiento?
- Que accion conviene hacer?

## 3. Acciones rapidas

Debe permitir actuar sin navegar demasiado.

Acciones sugeridas:

- crear tarea;
- registrar actividad;
- crear oportunidad;
- agregar contacto;
- agregar nota;
- marcar proxima accion;
- cambiar estado comercial;
- revisar senales;
- abrir sitio web;
- copiar telefono o contacto.

## 4. Contactos

Debe mostrar personas relevantes para la gestion.

Contenido:

- nombre;
- cargo;
- area;
- telefono;
- email;
- nivel de influencia;
- estado del contacto;
- fecha de ultimo contacto;
- observaciones.

Debe distinguir contacto principal de contactos secundarios.

## 5. Tareas pendientes

Debe mostrar que hay que hacer con ese municipio.

Contenido:

- titulo de tarea;
- responsable;
- prioridad;
- vencimiento;
- estado;
- oportunidad relacionada, si aplica.

Debe destacar tareas vencidas o de alta prioridad.

## 6. Actividades recientes

Debe mostrar que paso con la cuenta.

Contenido:

- llamadas;
- reuniones;
- emails;
- mensajes;
- propuestas enviadas;
- cambios de estado;
- notas;
- actualizaciones importantes.

El historial de la cuenta debe ser una vista cronologica de actividades, no una entidad separada.

## 7. Oportunidades

Debe mostrar posibilidades comerciales activas o pasadas.

Contenido:

- titulo de oportunidad;
- producto asociado;
- estado;
- valor estimado;
- probabilidad;
- responsable;
- proxima accion;
- fecha estimada de cierre.

Debe ayudar a entender si existe una venta, ampliacion, renovacion o recuperacion en curso.

## 8. Productos contratados

Debe mostrar que tiene contratado el municipio con Alertatel.

Contenido:

- producto;
- cantidad;
- monto;
- fecha de inicio;
- estado;
- condiciones;
- observaciones.

Para clientes, este bloque es clave. Para prospectos, puede mostrar productos potenciales o recomendados en una version futura.

## 9. Senales comerciales

Debe mostrar alertas o indicios que pueden justificar accion.

Contenido:

- tipo de senal;
- descripcion;
- origen;
- fuente;
- fecha de deteccion;
- confianza;
- estado;
- accion recomendada.

Ejemplos:

- datos incompletos;
- municipio similar a clientes actuales;
- cambio institucional;
- oportunidad territorial;
- falta de seguimiento;
- posible renovacion;
- senal publica relevante.

## 10. Datos institucionales

Debe mostrar informacion base del municipio.

Contenido:

- intendente;
- partido politico;
- poblacion;
- localidades;
- direccion institucional;
- telefono municipal;
- sitio web;
- perfil economico;
- distancia a capital;
- seccion electoral.

Este bloque da contexto, pero no debe desplazar la informacion comercial.

## 11. Documentos y enlaces

Debe reunir materiales relevantes.

Contenido:

- propuestas;
- contratos;
- notas;
- archivos internos;
- documentos publicos;
- enlaces utiles;
- sitio web oficial.

## Campos principales

Campos que deberian estar visibles en la ficha:

- municipio;
- estado comercial;
- prioridad;
- responsable interno;
- proxima accion;
- fecha de proxima accion;
- cantidad de botones;
- monto que paga;
- sistema actual;
- contacto principal;
- telefono de contacto;
- sitio web;
- intendente;
- partido politico;
- poblacion;
- seccion electoral;
- ultima actividad;
- oportunidades activas;
- tareas pendientes;
- senales pendientes.

## Campos editables

Campos que el equipo de Alertatel deberia poder editar:

- estado comercial;
- prioridad;
- responsable interno;
- sistema actual;
- contacto principal;
- telefono de contacto;
- email;
- notas;
- cantidad de botones;
- monto que paga;
- fecha de inicio;
- proxima accion;
- fecha de proxima accion;
- tareas;
- actividades;
- oportunidades;
- productos contratados;
- observaciones comerciales;
- decision sobre senales comerciales.

Estos campos representan conocimiento interno y gestion comercial.

## Campos automaticos o externos

Campos que idealmente deberian venir de fuentes externas, cargas controladas o actualizaciones dinamicas:

- poblacion;
- intendente;
- partido politico;
- sitio web oficial;
- telefono municipal;
- direccion institucional;
- localidades;
- seccion electoral;
- perfil economico;
- datos publicos relevantes;
- cambios institucionales;
- noticias o senales externas.

Algunos de estos datos pueden requerir revision humana. El sistema deberia poder marcar un dato como:

- pendiente de revision;
- validado;
- corregido manualmente;
- posiblemente desactualizado.

## Acciones disponibles

La ficha debe permitir acciones concretas:

- crear tarea;
- completar tarea;
- registrar actividad;
- crear oportunidad;
- actualizar estado comercial;
- asignar responsable;
- agregar contacto;
- editar contacto;
- agregar nota;
- vincular documento;
- revisar senal comercial;
- convertir senal en oportunidad;
- marcar dato como validado;
- marcar dato como incompleto;
- abrir mapa centrado en el municipio;
- abrir sitio web oficial;
- preparar seguimiento comercial.

## Relacion con tareas

Las tareas representan acciones pendientes relacionadas con el municipio.

Desde la ficha se debe poder:

- ver tareas abiertas;
- crear una tarea nueva;
- completar una tarea;
- cambiar responsable;
- cambiar fecha;
- asociar tarea a oportunidad;
- convertir una tarea completada en actividad registrada.

La ficha debe destacar tareas vencidas o criticas.

## Relacion con actividades

Las actividades representan hechos ocurridos.

Desde la ficha se debe poder:

- ver actividades recientes;
- registrar llamada;
- registrar reunion;
- registrar email o mensaje;
- registrar propuesta enviada;
- registrar cambio de estado;
- registrar nota importante.

El historial del municipio debe ser una vista cronologica de actividades.

## Relacion con oportunidades

Las oportunidades representan posibilidades comerciales concretas.

Desde la ficha se debe poder:

- ver oportunidades activas;
- crear oportunidad;
- cambiar estado;
- asociar producto;
- definir valor estimado;
- crear tareas vinculadas;
- registrar actividades relacionadas;
- marcar como ganada, perdida o pausada.

La ficha debe mostrar claramente si el municipio tiene una oportunidad abierta y cual es el siguiente paso.

## Relacion con senales comerciales

Las senales comerciales son indicios que pueden requerir accion.

Desde la ficha se debe poder:

- ver senales nuevas o pendientes;
- aceptar una senal;
- descartar una senal;
- crear tarea desde una senal;
- convertir senal en oportunidad;
- marcar datos para revisar;
- ver fuente y fecha de deteccion.

Las senales deben ayudar a priorizar, no distraer.

## Version inicial con datos actuales del JSON

Con los datos actuales disponibles, la ficha inicial puede mostrar:

### Encabezado

- nombre;
- estado;
- seccion electoral;
- provincia.

### Resumen comercial

- estado;
- cantidad de botones;
- monto que paga;
- fecha de inicio;
- sistema actual;
- contacto;
- telefono de contacto.

### Datos institucionales

- intendente;
- partido politico;
- poblacion;
- localidades;
- distancia a capital;
- sitio web;
- telefono municipal;
- direccion postal;
- perfil economico;
- parques industriales;
- fiestas locales;
- incendios e inundaciones reportadas.

### Ubicacion

- latitud;
- longitud;
- visualizacion en mapa.

### Limitaciones de la version inicial

- No hay tareas reales.
- No hay actividades reales.
- No hay oportunidades estructuradas.
- No hay contactos normalizados.
- No hay documentos.
- No hay senales comerciales estructuradas.
- No hay responsable interno.
- No hay historial cronologico.

Esta version inicial debe ordenar mejor lo existente sin inventar datos que no estan cargados.

## Version futura con base de datos e IA

Con una base de datos y asistencia inteligente, la ficha podria evolucionar hacia una cuenta viva.

### Mejoras con base de datos

- edicion de campos comerciales;
- contactos multiples;
- productos contratados;
- tareas;
- actividades;
- oportunidades;
- documentos;
- responsables internos;
- historial cronologico;
- fechas de seguimiento;
- cambios de estado;
- validacion de datos.

### Mejoras con IA

- resumen automatico del municipio;
- explicacion de prioridad;
- sugerencia de proxima accion;
- deteccion de datos incompletos;
- deteccion de cuentas sin seguimiento;
- comparacion con municipios similares;
- identificacion de potencial comercial;
- generacion de borradores de mensajes;
- resumen de reuniones o actividades;
- recomendacion de convertir senales en oportunidades.

La IA debe asistir al usuario, no decidir sola. Toda recomendacion importante debe poder ser revisada, aceptada o descartada.

## Criterio de exito

La ficha funciona bien si el usuario puede abrir un municipio y responder en menos de un minuto:

- que relacion tiene Alertatel con este municipio;
- que valor actual o potencial tiene;
- con quien hay que hablar;
- que paso recientemente;
- que esta pendiente;
- cual es la proxima accion;
- si hay una oportunidad comercial concreta.

Si la ficha solo muestra datos, no alcanza. Debe orientar la accion comercial.
