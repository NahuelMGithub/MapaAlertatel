# Pantallas del CRM Comercial Inteligente de Alertatel

## Proposito

Este documento define las pantallas principales del CRM comercial inteligente de Alertatel y que problema resuelve cada una.

No describe implementacion tecnica. El objetivo es ordenar la experiencia del producto alrededor del trabajo comercial diario: entender territorio, priorizar municipios, dar seguimiento, registrar actividades y detectar oportunidades.

## Principio general

Todas las pantallas deben trabajar sobre las mismas entidades centrales:

- Municipio
- Tarea
- Actividad
- Oportunidad
- Senal comercial

El mapa es una vista importante, pero no es el producto completo. El CRM debe permitir trabajar desde mapa, listas, fichas, tareas, reuniones, oportunidades y senales.

## Dirección actual de pantallas

No se van a construir todas las pantallas completas desde el inicio.

El producto se organizará en dos modos:

- Modo exploración: mapa, búsqueda de municipios, análisis de prospectos, comparación territorial y preparación de reuniones.
- Modo ejecución: trabajo diario con checklist, trabajo semanal, trabajo mensual estilo OKR y seguimiento de tareas, avances y prioridades.

Las pantallas deben priorizar cinco capacidades:

- Estado comercial claro por cuenta.
- Próxima acción obligatoria.
- Contactos por municipio.
- Productos contratados.
- Señales comerciales automáticas.

Las pantallas de oportunidades, reuniones, documentos y administración avanzada quedan como futuras mientras no estén resueltas estas prioridades.

## Dashboard / Trabajo diario

### Objetivo

Dar al usuario una vista rapida de que necesita hacer hoy y que temas requieren atencion.

Debe responder:

- Que tareas tengo pendientes.
- Que acciones estan vencidas.
- Que municipios necesitan seguimiento.
- Que oportunidades estan activas.
- Que senales nuevas deberia revisar.
- Qué objetivo semanal o mensual está en riesgo.

### Usuario principal

Responsable comercial o usuario interno que gestiona cuentas, tareas y oportunidades.

### Datos que muestra

- Tareas del dia.
- Tareas vencidas.
- Proximas reuniones.
- Próximas acciones obligatorias.
- Municipios sin seguimiento reciente.
- Senales comerciales nuevas.
- Resumen de clientes, prospectos y oportunidades.
- Actividades recientes relevantes.
- Avance semanal.
- Avance mensual estilo OKR.

### Acciones disponibles

- Abrir una tarea.
- Marcar tarea como completada.
- Crear nueva tarea.
- Abrir ficha de municipio.
- Registrar actividad rapida.
- Revisar senal comercial.
- Abrir oportunidad.
- Filtrar por responsable, prioridad o fecha.

### Relacion con entidades

- Municipio: muestra cuentas que requieren accion.
- Tarea: es la entidad principal de esta pantalla.
- Actividad: permite ver que paso recientemente y registrar nuevos hechos.
- Oportunidad: destaca oportunidades activas o prioritarias.
- Senal comercial: muestra alertas pendientes de revision.

### Version futura

- Recomendaciones inteligentes de proxima accion.
- Priorizacion automatica del dia.
- Resumen generado de cuentas criticas.
- Deteccion de municipios abandonados o sin seguimiento.
- Alertas personalizadas por responsable.

## Mapa comercial

### Objetivo

Visualizar territorialmente clientes, prospectos, oportunidades y zonas de interes comercial.

Debe responder:

- Donde estan nuestros clientes.
- Donde estan los prospectos.
- Que zonas tienen oportunidades.
- Que municipios estan pendientes de accion.
- Como se distribuye la cobertura de Alertatel.

### Usuario principal

Responsable comercial, direccion comercial o cualquier usuario que necesite entender cobertura territorial.

### Datos que muestra

- Municipios geolocalizados.
- Estado comercial.
- Prioridad.
- Cantidad de botones, si aplica.
- Monto actual o potencial.
- Oportunidades activas.
- Tareas pendientes asociadas al territorio.
- Senales comerciales por zona.

### Acciones disponibles

- Filtrar municipios.
- Seleccionar un municipio.
- Abrir ficha de municipio.
- Ver resumen comercial del municipio.
- Crear tarea desde un municipio.
- Crear oportunidad desde un municipio.
- Cambiar foco entre clientes, prospectos, oportunidades o tareas.

### Relacion con entidades

- Municipio: entidad central de la vista.
- Tarea: puede mostrarse como indicador de accion pendiente.
- Actividad: puede consultarse desde la ficha o resumen del municipio.
- Oportunidad: puede destacarse sobre el mapa.
- Senal comercial: puede aparecer como alerta territorial.

### Version futura

- Poligonos por municipio.
- Capas por estado comercial, prioridad o oportunidad.
- Mapa de calor de potencial.
- Comparacion por seccion electoral o region.
- Recomendaciones territoriales asistidas.

## Listado de municipios

### Objetivo

Permitir comparar, filtrar y ordenar municipios de forma mas precisa que en el mapa.

Debe responder:

- Que municipios son clientes.
- Que prospectos tienen mayor potencial.
- Cuales tienen datos incompletos.
- Cuales no tienen seguimiento reciente.
- Cuales tienen oportunidades activas.

### Usuario principal

Responsable comercial y usuarios que necesitan trabajar con volumen de cuentas.

### Datos que muestra

- Nombre del municipio.
- Estado comercial.
- Responsable.
- Prioridad.
- Poblacion.
- Sistema actual.
- Cantidad de botones.
- Monto mensual o potencial.
- Ultima actividad.
- Proxima tarea.
- Oportunidades activas.
- Senales pendientes.

### Acciones disponibles

- Buscar municipio.
- Filtrar por estado, prioridad, responsable, zona o seccion.
- Ordenar por poblacion, monto, prioridad o ultima actividad.
- Abrir ficha de municipio.
- Crear tarea.
- Crear oportunidad.
- Marcar datos como pendientes de completar.

### Relacion con entidades

- Municipio: entidad principal de la pantalla.
- Tarea: muestra proxima accion o tareas pendientes.
- Actividad: muestra ultima actividad relevante.
- Oportunidad: permite identificar cuentas con gestion comercial activa.
- Senal comercial: indica municipios con alertas o datos a revisar.

### Version futura

- Vistas guardadas por usuario.
- Segmentacion inteligente.
- Comparacion entre municipios similares.
- Exportacion de listados comerciales.
- Puntuacion de oportunidad sugerida.

## Ficha de municipio

### Objetivo

Concentrar toda la informacion relevante de una cuenta en un solo lugar.

Debe responder:

- Que sabemos de este municipio.
- Es cliente, prospecto u oportunidad.
- Quien es el contacto.
- Que productos tiene o podria tener.
- Que paso hasta ahora.
- Que hay que hacer despues.

### Usuario principal

Responsable comercial que gestiona o consulta una cuenta.

### Datos que muestra

- Datos institucionales.
- Estado comercial.
- Responsable interno.
- Contactos.
- Productos contratados.
- Oportunidades.
- Tareas.
- Actividades.
- Documentos.
- Senales comerciales.
- Notas y observaciones.
- Proxima accion.

### Acciones disponibles

- Editar datos comerciales.
- Agregar contacto.
- Crear tarea.
- Registrar actividad.
- Crear oportunidad.
- Adjuntar o vincular documento.
- Revisar senal comercial.
- Cambiar estado comercial.
- Asignar responsable.

### Relacion con entidades

- Municipio: es la entidad central.
- Tarea: muestra pendientes y permite crear nuevas.
- Actividad: forma el historial cronologico de la ficha.
- Oportunidad: muestra oportunidades vinculadas a la cuenta.
- Senal comercial: muestra alertas o pistas relacionadas.

### Version futura

- Resumen inteligente de la cuenta.
- Sugerencia de proxima accion.
- Deteccion automatica de datos incompletos.
- Timeline enriquecido.
- Comparacion con municipios similares.

## Tareas

### Objetivo

Gestionar acciones pendientes del equipo comercial.

Debe responder:

- Que hay que hacer.
- Quien es responsable.
- Para cuando.
- Que esta vencido.
- Que tareas estan asociadas a oportunidades o municipios importantes.

### Usuario principal

Responsable comercial y coordinador comercial.

### Datos que muestra

- Titulo de tarea.
- Municipio asociado.
- Contacto asociado.
- Oportunidad asociada.
- Responsable.
- Prioridad.
- Fecha de vencimiento.
- Estado.
- Tipo de tarea.
- Resultado esperado.

### Acciones disponibles

- Crear tarea.
- Editar tarea.
- Cambiar responsable.
- Cambiar fecha.
- Marcar como completada.
- Cancelar tarea.
- Abrir municipio asociado.
- Registrar actividad al completar.

### Relacion con entidades

- Municipio: una tarea puede estar asociada a una cuenta.
- Tarea: entidad principal de la pantalla.
- Actividad: una tarea completada puede generar una actividad.
- Oportunidad: una tarea puede formar parte de una oportunidad.
- Senal comercial: una senal puede generar una tarea de revision.

### Version futura

- Agenda semanal.
- Recordatorios automaticos.
- Priorizacion sugerida.
- Tareas recurrentes.
- Asignacion automatica por responsable o zona.

## Reuniones

### Objetivo

Organizar y registrar reuniones comerciales o institucionales.

Debe responder:

- Que reuniones estan programadas.
- Con que municipio o contacto.
- Que objetivo tiene la reunion.
- Que resultado tuvo.
- Que tarea u oportunidad sigue despues.

### Usuario principal

Responsable comercial, direccion comercial o usuario que participa en reuniones.

### Datos que muestra

- Fecha y hora.
- Municipio.
- Contactos participantes.
- Usuarios internos participantes.
- Objetivo.
- Estado: programada, realizada, cancelada, reprogramada.
- Oportunidad asociada.
- Temas tratados.
- Resultado.
- Proxima accion.

### Acciones disponibles

- Crear reunion.
- Editar fecha y participantes.
- Asociar municipio.
- Asociar oportunidad.
- Registrar resultado.
- Crear tareas posteriores.
- Registrar actividad de reunion realizada.

### Relacion con entidades

- Municipio: toda reunion deberia vincularse a una cuenta cuando sea posible.
- Tarea: una reunion puede nacer de una tarea o generar tareas posteriores.
- Actividad: una reunion realizada debe quedar registrada como actividad.
- Oportunidad: puede estar vinculada a una negociacion o propuesta.
- Senal comercial: una senal puede motivar una reunion.

### Version futura

- Integracion con calendario.
- Resumen automatico de reunion.
- Plantillas de minuta.
- Sugerencia de temas a tratar.
- Alertas si no se registra resultado.

## Oportunidades

### Objetivo

Gestionar posibilidades comerciales concretas.

Debe responder:

- Que oportunidades estan activas.
- En que estado estan.
- Que valor estimado tienen.
- Que falta para avanzar.
- Que oportunidades estan trabadas o sin seguimiento.

### Usuario principal

Responsable comercial y direccion comercial.

### Datos que muestra

- Titulo de oportunidad.
- Municipio.
- Producto o productos asociados.
- Contacto principal.
- Estado.
- Prioridad.
- Valor estimado.
- Probabilidad.
- Responsable.
- Proxima accion.
- Fecha estimada de cierre.
- Actividades recientes.

### Acciones disponibles

- Crear oportunidad.
- Cambiar estado.
- Asignar responsable.
- Vincular producto.
- Crear tarea.
- Registrar actividad.
- Asociar documento.
- Marcar como ganada o perdida.
- Indicar motivo de perdida.

### Relacion con entidades

- Municipio: toda oportunidad debe pertenecer a una cuenta.
- Tarea: define acciones necesarias para avanzar.
- Actividad: registra llamadas, reuniones, propuestas y cambios.
- Oportunidad: entidad principal de la pantalla.
- Senal comercial: puede ser origen de una oportunidad.

### Version futura

- Pipeline comercial visual.
- Probabilidad sugerida.
- Valor potencial calculado.
- Recomendacion de proxima accion.
- Analisis de oportunidades similares.

## Senales comerciales

### Objetivo

Mostrar indicios, alertas o pistas que pueden ayudar a detectar oportunidades o riesgos comerciales.

Debe responder:

- Que informacion nueva deberia revisar.
- Que municipios muestran señales de oportunidad.
- Que datos parecen incompletos o desactualizados.
- Que eventos pueden requerir accion comercial.

### Usuario principal

Responsable comercial, direccion comercial o usuario encargado de revisar oportunidades.

### Datos que muestra

- Titulo de la senal.
- Municipio asociado.
- Tipo de senal.
- Origen.
- Fuente.
- Fecha de deteccion.
- Nivel de confianza.
- Prioridad sugerida.
- Estado: nueva, revisada, aceptada, descartada, convertida en oportunidad.
- Observaciones.

### Acciones disponibles

- Revisar senal.
- Aceptar senal.
- Descartar senal.
- Crear tarea.
- Crear oportunidad.
- Abrir municipio.
- Agregar observacion.
- Marcar como dato a verificar.

### Relacion con entidades

- Municipio: una senal normalmente apunta a una cuenta.
- Tarea: una senal puede generar una accion de revision o contacto.
- Actividad: la revision de una senal puede quedar registrada.
- Oportunidad: una senal aceptada puede convertirse en oportunidad.
- Senal comercial: entidad principal de la pantalla.

### Version futura

- Senales generadas automaticamente.
- Priorizacion con IA.
- Deteccion de cambios publicos.
- Comparacion con clientes similares.
- Explicacion de por que una senal importa.

## Administracion / carga de datos

### Objetivo

Permitir mantener actualizada la informacion del CRM sin depender de edicion manual de archivos.

Debe responder:

- Que datos se pueden cargar o corregir.
- Que informacion esta incompleta.
- Que campos requieren revision.
- Que datos son internos y cuales vienen de fuentes externas.

### Usuario principal

Usuario interno responsable de carga, mantenimiento de datos o administracion comercial.

### Datos que muestra

- Municipios.
- Contactos.
- Productos.
- Productos contratados.
- Usuarios internos.
- Estados comerciales.
- Datos incompletos.
- Datos pendientes de revision.
- Fuentes de informacion.

### Acciones disponibles

- Editar datos comerciales.
- Cargar contacto.
- Cargar producto contratado.
- Corregir informacion institucional.
- Asignar responsable.
- Revisar datos incompletos.
- Marcar dato como validado.
- Importar o revisar datos cargados.

### Relacion con entidades

- Municipio: permite corregir y completar informacion base o comercial.
- Tarea: puede crear tareas de actualizacion o seguimiento.
- Actividad: cambios importantes pueden registrarse como actividad.
- Oportunidad: puede corregir datos asociados.
- Senal comercial: puede revisar datos detectados como dudosos.

### Version futura

- Importacion asistida.
- Validaciones automaticas.
- Deteccion de duplicados.
- Roles y permisos.
- Auditoria de cambios.
- Revision asistida de datos externos.

## Criterio de prioridad para construir pantallas

Orden sugerido:

1. Ficha de municipio con estado comercial, próxima acción, contactos y productos contratados.
2. Trabajo diario con checklist.
3. Listado de municipios orientado a exploración.
4. Mapa comercial como vista de exploración.
5. Señales comerciales automáticas.
6. Trabajo semanal y mensual estilo OKR.
7. Administración mínima para editar datos prioritarios.
8. Oportunidades, reuniones y documentos como pantallas futuras.

El mapa ya existe como base y debe mantenerse. Pero el crecimiento del CRM debe priorizar las pantallas que permitan explorar municipios y ejecutar trabajo comercial sobre estado, próxima acción, contactos, productos contratados y señales comerciales.
