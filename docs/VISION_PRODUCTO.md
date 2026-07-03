# Vision de Producto - CRM Comercial Inteligente de Alertatel

## Proposito

Alertatel necesita una herramienta propia para entender, priorizar y gestionar oportunidades comerciales en municipios, organismos y territorios.

El producto ya no debe pensarse como un mapa de municipios. El mapa es una vista util, pero el objetivo real es construir el CRM comercial e inteligente de Alertatel: un sistema interno que concentre informacion, seguimiento, contexto y accion comercial.

La herramienta debe ayudar a responder preguntas concretas:

- Donde tenemos clientes.
- Donde tenemos prospectos.
- Que municipios tienen mayor potencial.
- Con quien hablamos.
- Que se negocio.
- Que falta hacer.
- Que oportunidad comercial existe.
- Que datos necesitamos completar.
- Cual es la proxima accion recomendada.

El sistema debe convertirse en el lugar donde Alertatel mira su territorio comercial, organiza su seguimiento y toma mejores decisiones.

## Vision del producto

Construir un CRM comercial pensado especificamente para Alertatel, donde cada municipio u organismo tenga una ficha viva que combine datos institucionales, informacion comercial, historial de relacion, notas internas, tareas pendientes y senales de oportunidad.

El producto debe funcionar como una mesa de trabajo comercial:

- Una vista de mapa para comprender territorio y cobertura.
- Una vista de lista para comparar y priorizar.
- Una vista de tareas para accionar.
- Una ficha completa para entender cada cuenta.
- Un resumen comercial para decidir donde enfocar energia.

La herramienta debe ser simple de usar, pero suficientemente ordenada para que la informacion no dependa de memoria, mensajes sueltos o archivos separados.

## Principios de diseno

El sistema debe seguir estos principios:

- Claridad antes que complejidad.
- Uso comercial real antes que funcionalidades decorativas.
- Informacion accionable antes que datos acumulados sin criterio.
- Evolucion gradual sin romper lo que ya funciona.
- Cada ficha debe ayudar a tomar una decision.
- Cada vista debe responder una necesidad concreta.
- El usuario debe saber rapidamente que paso, que falta y que hacer despues.
- La carga manual debe ser minima, clara y valiosa.
- Los datos deben tener contexto: no alcanza con guardar informacion, hay que mostrar por que importa.
- El sistema debe adaptarse al trabajo diario de Alertatel, no forzar una forma generica de CRM.

## Problemas que busca resolver

Hoy la informacion comercial puede quedar dispersa en planillas, archivos, conversaciones, memoria individual o datos incompletos.

El sistema busca resolver:

- Falta de una vista unica de clientes y prospectos.
- Dificultad para saber que municipios requieren seguimiento.
- Perdida de contexto comercial entre conversaciones.
- Falta de criterios claros para priorizar oportunidades.
- Datos importantes mezclados o dificiles de encontrar.
- Seguimiento comercial dependiente de personas puntuales.
- Dificultad para ver cobertura territorial y zonas pendientes.
- Falta de historial sobre contactos, propuestas y decisiones.
- Ausencia de una agenda clara de proximas acciones.
- Baja capacidad para comparar oportunidades entre municipios.

## Entidades principales

El sistema debe organizarse alrededor de entidades simples y comprensibles para el negocio.

### Municipio u organismo

Es la cuenta principal de trabajo. Puede ser cliente, prospecto, oportunidad, descartado o estar pendiente de clasificacion.

Debe reunir informacion institucional, territorial y comercial.

### Contacto

Persona relevante dentro del municipio u organismo.

Puede incluir rol, area, telefono, correo, nivel de relacion, ultimo contacto y observaciones.

### Oportunidad comercial

Representa una posibilidad concreta de venta, ampliacion, renovacion o recuperacion.

Debe tener estado, prioridad, valor estimado, probabilidad, responsable y proxima accion.

### Tarea

Accion pendiente que alguien de Alertatel debe realizar.

Ejemplos:

- Llamar.
- Enviar propuesta.
- Pedir contacto.
- Coordinar reunion.
- Hacer seguimiento.
- Actualizar datos.

### Nota

Registro simple de informacion relevante.

Debe servir para conservar contexto, no para acumular texto sin orden.

### Historial

Linea de tiempo de hechos importantes:

- cambios de estado;
- reuniones;
- llamados;
- propuestas enviadas;
- comentarios relevantes;
- decisiones comerciales;
- cambios de responsable;
- actualizaciones de datos.

### Indicador comercial

Dato que ayuda a priorizar.

Ejemplos:

- cantidad de botones;
- monto mensual;
- potencial estimado;
- sistema actual;
- poblacion;
- zona;
- urgencia;
- nivel de relacion;
- fecha de proxima accion.

## Vistas del sistema

El CRM debe ofrecer distintas formas de mirar la misma informacion.

### Vista de mapa

Sirve para entender territorio, cobertura, zonas con clientes, zonas con prospectos y oportunidades geograficas.

No debe ser la unica forma de trabajar. Es una vista del sistema, no el sistema completo.

### Vista de lista comercial

Sirve para comparar municipios y ordenar por criterios comerciales.

Debe permitir encontrar rapidamente:

- clientes;
- prospectos;
- oportunidades activas;
- cuentas sin seguimiento;
- municipios con mayor potencial;
- municipios con datos incompletos.

### Vista de tareas

Sirve para el trabajo diario.

Debe mostrar que acciones hay que hacer, cuales estan vencidas, cuales son prioritarias y quien es responsable.

### Ficha de cuenta

Es el centro de informacion de cada municipio u organismo.

Debe mostrar:

- estado comercial;
- datos principales;
- contactos;
- sistema actual;
- cantidad de botones;
- monto que paga o potencial estimado;
- notas;
- tareas;
- historial;
- proxima accion.

### Vista de seguimiento

Sirve para entender que paso con una cuenta a lo largo del tiempo.

Debe evitar que se pierda contexto cuando cambia el responsable o pasa mucho tiempo entre contactos.

### Vista de resumen ejecutivo

Sirve para tomar decisiones comerciales generales.

Debe mostrar:

- cantidad de clientes;
- cantidad de prospectos;
- oportunidades activas;
- tareas vencidas;
- zonas con mayor potencial;
- ingresos actuales;
- ingresos potenciales;
- cuentas sin actualizar.

## Ayuda al trabajo diario

El sistema debe ayudar al usuario a trabajar mejor, no solo a guardar datos.

Debe permitir:

- Arrancar el dia viendo tareas pendientes.
- Detectar oportunidades que requieren seguimiento.
- Abrir una cuenta y entender su situacion en segundos.
- Saber cuando fue el ultimo contacto.
- Saber que se prometio o que se envio.
- Registrar una nota sin friccion.
- Marcar una proxima accion.
- Priorizar llamadas o reuniones.
- Identificar municipios con informacion incompleta.
- Comparar prospectos por potencial.
- Ver rapidamente donde Alertatel ya tiene presencia y donde no.

La herramienta debe reducir dependencia de memoria individual y convertir informacion dispersa en accion organizada.

## Convivencia de datos

El producto debe convivir con distintos tipos de datos.

### Datos manuales

Son los datos cargados por el equipo.

Ejemplos:

- notas;
- contactos;
- estado comercial;
- prioridad;
- proxima accion;
- resultado de una conversacion.

Estos datos suelen ser los mas valiosos porque reflejan conocimiento interno.

### Datos internos

Son datos propios de Alertatel.

Ejemplos:

- clientes actuales;
- cantidad de botones;
- montos;
- fecha de inicio;
- sistema contratado;
- historial comercial.

Estos datos deben ser confiables, claros y faciles de actualizar.

### Datos publicos

Son datos disponibles sobre municipios, autoridades, poblacion, ubicacion, web oficial u otra informacion institucional.

Deben enriquecer la ficha, pero no reemplazar la mirada comercial.

### Datos dinamicos

Son datos que pueden cambiar con el tiempo.

Ejemplos:

- autoridades;
- sitios web;
- telefonos;
- noticias;
- senales de oportunidad;
- cambios institucionales.

El sistema debe poder mostrar cuando un dato necesita revision o cuando existe una posible novedad relevante.

## Inteligencia futura

En una etapa futura, el CRM debe incorporar asistencia inteligente para ayudar a analizar, resumir y priorizar.

La inteligencia del sistema debe servir para:

- resumir fichas largas;
- detectar cuentas sin seguimiento;
- sugerir proximas acciones;
- identificar oportunidades similares a clientes actuales;
- marcar datos incompletos o posiblemente desactualizados;
- ayudar a redactar notas, mensajes o propuestas;
- explicar por que una cuenta puede tener prioridad alta;
- encontrar patrones entre zona, poblacion, sistema actual y potencial comercial.

La inteligencia debe complementar el criterio humano. No debe tomar decisiones comerciales sola ni reemplazar la validacion del equipo.

## Valor frente a un CRM tradicional

Un CRM tradicional suele ser generico. Sirve para muchas industrias, pero no entiende naturalmente el territorio, los municipios, las relaciones institucionales ni la forma de vender de Alertatel.

Este producto aporta valor porque:

- Esta pensado alrededor de municipios y organismos.
- Combina mirada territorial y seguimiento comercial.
- Permite trabajar con mapa, lista, tareas y ficha en un mismo sistema.
- Relaciona datos institucionales con oportunidades comerciales.
- Ayuda a priorizar segun criterios propios de Alertatel.
- Conserva contexto historico de cada cuenta.
- Puede evolucionar con datos publicos y senales dinamicas.
- Se adapta al lenguaje y flujo de trabajo interno.
- Convierte informacion dispersa en decisiones y acciones.

El objetivo no es copiar un CRM generico. El objetivo es construir una herramienta comercial propia, enfocada en el negocio real de Alertatel.

## Resultado esperado

El resultado esperado es un sistema interno que permita a Alertatel:

- conocer mejor su territorio comercial;
- cuidar mejor a sus clientes;
- detectar mejores oportunidades;
- dar seguimiento con mas orden;
- reducir perdida de informacion;
- priorizar acciones;
- tomar decisiones con mas contexto;
- crecer desde una base simple y clara.

El mapa sigue siendo importante, pero deja de ser el centro conceptual del proyecto. El centro pasa a ser la gestion comercial inteligente de cuentas, oportunidades y seguimiento.
