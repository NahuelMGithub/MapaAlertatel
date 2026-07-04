# Modelo de Datos Conceptual - CRM Comercial Inteligente de Alertatel

## Proposito del modelo

Este documento define el modelo conceptual del CRM comercial inteligente de Alertatel.

No describe implementacion tecnica, base de datos ni estructura de codigo. Su objetivo es ordenar que entidades existen en el producto, que informacion pertenece a cada una y como se relacionan entre si.

El municipio sigue siendo la entidad central del sistema, pero el producto ya no es solo un mapa. El mapa es una vista. El CRM debe permitir gestionar cuentas, contactos, productos, oportunidades, tareas, actividades, documentos, senales comerciales y seguimiento diario o semanal.

## Alcance prioritario del modelo

Aunque el modelo conceptual contempla varias entidades, el primer alcance real debe concentrarse en:

- Municipio.
- Estado comercial.
- Próxima acción.
- Contacto.
- Producto contratado.
- Señal comercial.
- Usuario interno o responsable, solo en la medida necesaria para asignar trabajo.

Las entidades de oportunidad, documento, actividad avanzada y pipeline completo quedan como soporte o evolución futura. No deben bloquear la primera versión útil.

## Principios del modelo

- El municipio es la cuenta principal de trabajo.
- El historial no es una entidad separada: es una vista cronologica de actividades.
- Toda informacion debe tener un lugar claro.
- Los datos comerciales propios de Alertatel deben separarse de los datos publicos o externos.
- Las tareas representan acciones pendientes.
- Las actividades representan hechos ocurridos.
- Las oportunidades representan posibilidades comerciales concretas.
- Las senales comerciales ayudan a detectar o priorizar oportunidades.
- La IA futura debe asistir sobre datos ordenados, no reemplazar el criterio comercial.

## Tipos de datos del sistema

El CRM debe convivir con distintos origenes de informacion.

### Datos manuales

Son cargados por usuarios internos.

Ejemplos:

- notas;
- tareas;
- comentarios de reuniones;
- contactos;
- estado comercial;
- prioridad;
- proxima accion;
- resultado de una llamada;
- evaluacion interna de oportunidad.

Estos datos deben ser editables porque reflejan conocimiento comercial actualizado por el equipo.

### Datos internos

Son datos propios de Alertatel.

Ejemplos:

- productos contratados;
- cantidad de botones;
- importes;
- fecha de inicio;
- estado del cliente;
- responsable comercial;
- documentos enviados;
- actividades comerciales.

Estos datos deben ser editables por usuarios autorizados, porque forman parte de la gestion interna.

### Datos publicos

Son datos disponibles sobre municipios u organismos.

Ejemplos:

- nombre oficial;
- provincia;
- poblacion;
- autoridades;
- sitio web oficial;
- telefono institucional;
- direccion;
- seccion electoral;
- informacion territorial.

Estos datos pueden mostrarse en la ficha, pero idealmente deben venir de fuentes externas o cargas controladas. El usuario interno podria corregirlos si hay error, pero no deberian mezclarse con los datos comerciales propios.

### Datos dinamicos

Son datos que pueden cambiar y que el sistema podria obtener o actualizar periodicamente.

Ejemplos:

- cambios de autoridades;
- novedades publicas;
- noticias;
- cambios en sitios oficiales;
- senales de compra;
- eventos relevantes;
- cambios institucionales.

Estos datos deberian indicar fuente, fecha de deteccion y nivel de confianza. No todos tienen que ser editables; algunos pueden ser revisados, aceptados o descartados por el equipo.

## Entidades principales

## Municipio

Representa una cuenta territorial o institucional. Es la entidad central del CRM.

Un municipio puede ser cliente, prospecto, oportunidad activa, descartado o estar pendiente de clasificacion.

Informacion sugerida:

- nombre;
- nombre oficial;
- provincia;
- partido o departamento;
- seccion electoral;
- poblacion;
- localidades;
- ubicacion geografica;
- sitio web oficial;
- telefono institucional;
- direccion institucional;
- intendente o autoridad principal;
- partido politico o espacio de gobierno;
- estado comercial;
- prioridad comercial;
- responsable comercial interno;
- sistema actual, si se conoce;
- observaciones generales;
- fecha de ultima actualizacion.
- próxima acción.
- fecha de próxima acción.

Relaciones:

- Un municipio puede tener muchos contactos.
- Un municipio puede tener muchos productos contratados.
- Un municipio puede tener muchas tareas.
- Un municipio puede tener muchas actividades.
- Un municipio puede tener muchas oportunidades.
- Un municipio puede tener muchas senales comerciales.
- Un municipio puede tener muchos documentos.
- Un municipio puede tener un responsable comercial principal.
- Un municipio debe tener una próxima acción cuando está activo comercialmente.
- Un municipio puede tener señales comerciales automáticas.

Datos editables:

- estado comercial;
- prioridad;
- responsable;
- sistema actual;
- observaciones;
- datos comerciales propios.

Datos preferentemente externos o controlados:

- poblacion;
- autoridades;
- ubicacion;
- sitio web oficial;
- informacion institucional.

## Contacto

Representa una persona relacionada con un municipio u organismo.

Puede ser un decisor, usuario, referente tecnico, administrativo, funcionario, asesor o contacto operativo.

Informacion sugerida:

- nombre;
- apellido;
- cargo;
- area;
- telefono;
- email;
- canal preferido de contacto;
- nivel de influencia;
- relacion con Alertatel;
- municipio asociado;
- observaciones;
- fecha de ultimo contacto;
- estado del contacto: activo, dudoso, desactualizado, no contactar.

Relaciones:

- Un contacto pertenece a un municipio u organismo.
- Un contacto puede estar asociado a actividades.
- Un contacto puede estar asociado a oportunidades.
- Un contacto puede estar asociado a documentos enviados o recibidos.

Datos editables:

- telefono;
- email;
- cargo;
- area;
- observaciones;
- nivel de influencia;
- estado del contacto.

Datos dinamicos o revisables:

- cargo actual;
- continuidad en el municipio;
- datos publicos de contacto.

## Producto

Representa una solucion, servicio o linea comercial ofrecida por Alertatel.

No describe una venta puntual, sino el catalogo conceptual de lo que Alertatel puede ofrecer.

Informacion sugerida:

- nombre del producto;
- descripcion comercial;
- categoria;
- estado: activo, discontinuado, futuro;
- unidad de referencia;
- indicadores comerciales relevantes;
- observaciones internas.

Ejemplos posibles:

- botones antipatico;
- sistema de alerta;
- mantenimiento;
- soporte;
- ampliaciones;
- modulos complementarios.

Relaciones:

- Un producto puede estar contratado por muchos municipios.
- Un producto puede estar asociado a muchas oportunidades.
- Un producto puede estar mencionado en actividades, documentos o senales comerciales.

Datos editables:

- descripcion comercial;
- categoria;
- estado;
- observaciones.

Datos internos:

- definicion del producto;
- criterios comerciales;
- reglas de uso interno.

## Producto contratado

Representa un producto efectivamente contratado por un municipio.

Es la relacion entre un municipio y un producto, con informacion comercial concreta.

Informacion sugerida:

- municipio;
- producto;
- estado del contrato: activo, pausado, finalizado, en revision;
- fecha de inicio;
- fecha de renovacion, si aplica;
- cantidad contratada;
- monto mensual;
- condiciones comerciales;
- responsable interno;
- observaciones;
- fecha de ultima actualizacion.

Relaciones:

- Pertenece a un municipio.
- Referencia un producto.
- Puede generar actividades.
- Puede generar tareas de renovacion, ampliacion o seguimiento.
- Puede estar asociado a documentos.

Datos editables:

- cantidad contratada;
- monto;
- estado;
- condiciones;
- observaciones;
- responsable.

Datos internos:

- importes;
- cantidades;
- vigencia;
- relacion contractual.

## Tarea

Representa una accion pendiente que debe realizar una persona de Alertatel.

Una tarea mira hacia adelante: algo que todavia hay que hacer.

Informacion sugerida:

- titulo;
- descripcion;
- municipio asociado;
- contacto asociado, si aplica;
- oportunidad asociada, si aplica;
- responsable;
- prioridad;
- estado: pendiente, en curso, completada, cancelada;
- fecha de vencimiento;
- fecha de creacion;
- fecha de cierre;
- tipo de tarea: llamar, enviar propuesta, pedir contacto, coordinar reunion, hacer seguimiento, actualizar datos;
- resultado esperado;
- observaciones.

Relaciones:

- Una tarea puede pertenecer a un municipio.
- Una tarea puede estar vinculada a una oportunidad.
- Una tarea puede estar vinculada a un contacto.
- Una tarea tiene un responsable interno.
- Una tarea completada puede generar una actividad.

Datos editables:

- titulo;
- descripcion;
- responsable;
- prioridad;
- fecha de vencimiento;
- estado;
- observaciones.

Datos generados por uso:

- fecha de creacion;
- fecha de cierre;
- actividad resultante.

## Actividad

Representa un hecho ocurrido en la relacion comercial.

Una actividad mira hacia atras: algo que ya paso.

El historial de un municipio no debe ser una entidad aparte. El historial es simplemente la vista cronologica de actividades vinculadas a ese municipio.

Informacion sugerida:

- tipo de actividad: llamada, reunion, email, mensaje, propuesta enviada, cambio de estado, nota, visita, carga de documento, actualizacion de datos;
- fecha;
- municipio asociado;
- contacto asociado, si aplica;
- oportunidad asociada, si aplica;
- usuario interno que la registro;
- descripcion;
- resultado;
- proxima accion sugerida;
- documentos asociados;
- datos modificados, si aplica;
- nivel de importancia.

Relaciones:

- Una actividad pertenece a un municipio.
- Una actividad puede estar vinculada a un contacto.
- Una actividad puede estar vinculada a una oportunidad.
- Una actividad puede cerrar o crear tareas.
- Una actividad puede tener documentos asociados.
- Una actividad fue registrada por un usuario interno.

Datos editables:

- descripcion;
- resultado;
- importancia;
- vinculos con contacto u oportunidad.

Datos generados por uso:

- fecha de registro;
- usuario que registro;
- cambios relevantes.

## Oportunidad

Representa una posibilidad comercial concreta.

Puede ser una venta nueva, ampliacion, renovacion, recuperacion, propuesta o proyecto en evaluacion.

Informacion sugerida:

- titulo;
- municipio;
- contacto principal;
- producto o productos asociados;
- estado: detectada, calificada, en contacto, propuesta enviada, negociacion, ganada, perdida, pausada;
- prioridad;
- valor estimado;
- probabilidad estimada;
- fecha de creacion;
- fecha estimada de cierre;
- responsable comercial;
- origen de la oportunidad;
- motivo de perdida, si aplica;
- proxima accion;
- observaciones.

Relaciones:

- Una oportunidad pertenece a un municipio.
- Una oportunidad puede involucrar uno o varios productos.
- Una oportunidad puede tener tareas.
- Una oportunidad puede tener actividades.
- Una oportunidad puede tener documentos.
- Una oportunidad puede haber surgido de una senal comercial.
- Una oportunidad tiene un responsable interno.

Datos editables:

- estado;
- prioridad;
- valor estimado;
- probabilidad;
- responsable;
- proxima accion;
- observaciones;
- motivo de perdida.

Datos dinamicos o asistidos:

- origen sugerido;
- prioridad sugerida;
- probabilidad estimada;
- senales relacionadas.

## Senal comercial

Representa un indicio que puede ser relevante para detectar, priorizar o revisar una oportunidad.

Una senal no es necesariamente una oportunidad. Puede ser una pista, alerta o dato que requiere evaluacion.

Informacion sugerida:

- titulo;
- descripcion;
- municipio asociado;
- tipo de senal: cambio institucional, noticia, dato incompleto, vencimiento, aumento de poblacion, cliente similar, actividad pendiente, oportunidad territorial;
- origen: manual, interno, publico, dinamico, asistido;
- fuente;
- fecha de deteccion;
- nivel de confianza;
- prioridad sugerida;
- estado: nueva, revisada, aceptada, descartada, convertida en oportunidad;
- usuario que la reviso;
- observaciones.

Tipos prioritarios:

- noticias;
- cambios institucionales;
- falta de seguimiento;
- patrones de datos;
- oportunidades detectadas automáticamente.

Relaciones:

- Una senal puede estar asociada a un municipio.
- Una senal puede generar una tarea.
- Una senal puede convertirse en oportunidad.
- Una senal puede estar vinculada a documentos, noticias o datos publicos.
- Una senal puede ser generada o priorizada por IA en el futuro.

Datos editables:

- estado;
- prioridad;
- observaciones;
- decision tomada.

Datos externos o dinamicos:

- fuente;
- fecha de deteccion;
- contenido detectado;
- nivel de confianza sugerido.

## Documento

Representa un archivo o referencia documental relevante para la gestion comercial.

Puede ser una propuesta, contrato, factura, nota, presentacion, ordenanza, archivo interno o documento publico.

Informacion sugerida:

- titulo;
- tipo de documento;
- descripcion;
- municipio asociado;
- contacto asociado, si aplica;
- oportunidad asociada, si aplica;
- producto contratado asociado, si aplica;
- fecha;
- origen: interno, cliente, publico, manual;
- estado: borrador, enviado, recibido, firmado, archivado;
- responsable;
- observaciones;
- etiquetas.

Relaciones:

- Un documento puede pertenecer a un municipio.
- Un documento puede estar vinculado a una oportunidad.
- Un documento puede estar vinculado a una actividad.
- Un documento puede estar vinculado a un producto contratado.
- Un documento puede estar asociado a un contacto.

Datos editables:

- titulo;
- descripcion;
- tipo;
- estado;
- etiquetas;
- observaciones;
- relaciones con municipio, oportunidad o actividad.

Datos internos o externos:

- origen del documento;
- fecha;
- contenido;
- estado de envio o recepcion.

## Usuario interno / responsable comercial

Representa una persona de Alertatel que usa el sistema o tiene responsabilidad sobre cuentas, tareas u oportunidades.

Informacion sugerida:

- nombre;
- apellido;
- rol;
- area;
- email;
- telefono interno, si aplica;
- estado: activo, inactivo;
- municipios asignados;
- oportunidades asignadas;
- tareas asignadas;
- observaciones.

Relaciones:

- Un usuario puede ser responsable de muchos municipios.
- Un usuario puede tener muchas tareas.
- Un usuario puede registrar muchas actividades.
- Un usuario puede ser responsable de oportunidades.
- Un usuario puede revisar senales comerciales.
- Un usuario puede cargar o enviar documentos.

Datos editables:

- rol;
- area;
- estado;
- asignaciones;
- observaciones.

Datos internos:

- responsabilidades;
- actividad registrada;
- tareas asignadas;
- cuentas bajo seguimiento.

## Relaciones principales del CRM

Las relaciones principales del modelo son:

- Municipio a contactos: un municipio puede tener muchos contactos.
- Municipio a productos contratados: un municipio puede tener varios productos contratados.
- Producto a productos contratados: un producto puede estar contratado por muchos municipios.
- Municipio a tareas: un municipio puede tener muchas tareas pendientes o cerradas.
- Municipio a actividades: un municipio puede tener muchas actividades. La vista cronologica de estas actividades forma el historial.
- Municipio a oportunidades: un municipio puede tener varias oportunidades comerciales.
- Oportunidad a tareas: una oportunidad puede requerir varias acciones.
- Oportunidad a actividades: una oportunidad puede tener llamadas, reuniones, propuestas y cambios de estado.
- Senal comercial a oportunidad: una senal puede convertirse en oportunidad.
- Documento a municipio, oportunidad o actividad: un documento puede dar contexto a una cuenta o gestion concreta.
- Usuario interno a tareas, actividades, municipios y oportunidades: el usuario interno permite asignar responsabilidad y seguimiento.

## Datos editables y datos externos

El CRM debe diferenciar claramente que puede editar Alertatel y que deberia venir de fuentes externas o revisables.

### Principalmente editables

- estado comercial del municipio;
- prioridad comercial;
- responsable comercial;
- contactos;
- tareas;
- actividades;
- oportunidades;
- notas y observaciones;
- productos contratados;
- montos;
- cantidades;
- documentos internos;
- decisiones sobre senales comerciales.

### Preferentemente externos o controlados

- poblacion;
- ubicacion geografica;
- autoridades publicas;
- sitio web oficial;
- telefono institucional;
- direccion institucional;
- datos publicos del municipio;
- noticias o novedades externas.

### Mixtos

Algunos datos pueden venir de una fuente externa pero requerir revision interna.

Ejemplos:

- intendente actual;
- partido politico;
- sitio web;
- telefono municipal;
- datos de contacto publicados;
- senales de oportunidad;
- indicadores de prioridad sugeridos.

En estos casos, el sistema deberia permitir marcar el dato como revisado, corregido, descartado o pendiente.

## Vistas derivadas del modelo

El mismo modelo debe alimentar varias vistas del sistema.

### Vista de mapa

Usa municipios, ubicacion, estado comercial, prioridad y oportunidades.

Sirve para entender territorio, cobertura y zonas de accion.

### Vista de ficha de municipio

Muestra la informacion consolidada de una cuenta:

- datos institucionales;
- estado comercial;
- contactos;
- productos contratados;
- oportunidades;
- tareas;
- actividades;
- documentos;
- senales comerciales.

### Vista de tareas

Muestra acciones pendientes por responsable, fecha, prioridad, municipio u oportunidad.

### Vista de oportunidades

Muestra oportunidades activas, estados, valor estimado, prioridad y proxima accion.

### Vista de historial

No necesita entidad propia.

Es una vista cronologica de actividades asociadas a un municipio, contacto, oportunidad o usuario interno.

### Vista de senales comerciales

Muestra alertas, pistas o recomendaciones pendientes de revision.

Puede servir para detectar oportunidades nuevas o cuentas que requieren seguimiento.

## Rol futuro de la IA sobre el modelo

La IA futura debe trabajar sobre este modelo ordenado.

Puede ayudar a:

- resumir actividades de un municipio;
- detectar tareas vencidas o cuentas sin seguimiento;
- sugerir proxima accion;
- explicar por que una oportunidad puede ser prioritaria;
- encontrar patrones entre municipios similares;
- convertir una senal comercial en una oportunidad sugerida;
- detectar datos incompletos o posiblemente desactualizados;
- preparar mensajes comerciales o resumentes ejecutivos.

La IA no debe ser el origen unico de verdad. Debe proponer, resumir, ordenar y asistir. Las decisiones comerciales importantes deben quedar validadas por usuarios internos.

## Criterio de crecimiento

El modelo debe crecer de forma gradual.

Primero hay que consolidar:

- municipio;
- contacto;
- producto;
- producto contratado;
- tarea;
- usuario interno.
- estado comercial;
- próxima acción;
- señal comercial.

Luego se pueden fortalecer:

- actividad;
- oportunidad;
- senales comerciales;
- documentos;
- vistas ejecutivas;
- asistencia inteligente;
- datos dinamicos.

El objetivo es que cada nuevo dato tenga una razon comercial clara y ayude al usuario a decidir o actuar mejor.
