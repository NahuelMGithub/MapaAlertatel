# Plan V2 - Evolucion del Mapa Alertatel

## 1. Objetivo general

Mejorar la app actual de mapa de municipios de Alertatel para que sea mas util como herramienta comercial interna, sin rehacerla desde cero.

La aplicacion debe seguir permitiendo visualizar municipios de Buenos Aires, distinguir clientes y prospectos, filtrar informacion y consultar rapidamente datos relevantes. La evolucion apunta a ordenar el proyecto, mejorar la interfaz, mejorar la calidad del modelo de datos y permitir editar informacion sin depender de cambios manuales sobre `municipios.json`.

La direccion recomendada es avanzar por etapas: primero reestructurar la base del frontend actual, luego mejorar la experiencia visual, despues normalizar datos, incorporar Node/Express + SQLite como backend local simple, sumar administracion, crear una vista de tareas y dejar IA o datos externos para el final.

## 2. Principio rector

El proyecto debe evolucionar sin romper lo que ya funciona.

La prioridad es conservar el mapa, los filtros y la visualizacion actual mientras se ordena la estructura. Cada fase debe dejar una version funcional. Primero se mueve, separa y ordena; despues se mejora; recien mas adelante se cambia la fuente de datos.

## 2.1 Prioridad actual

No se va a construir todo el CRM de golpe.

La prioridad de producto queda acotada a:

- Estado comercial claro por cuenta.
- Próxima acción obligatoria.
- Contactos por municipio.
- Productos contratados.
- Señales comerciales automáticas.

El sistema debe crecer alrededor de dos modos:

- Modo exploración: mapa, búsqueda, análisis de prospectos, comparación territorial y preparación de reuniones.
- Modo ejecución: trabajo diario, trabajo semanal, trabajo mensual estilo OKR y seguimiento de tareas, avances y prioridades.

Las funciones como pipeline completo, agenda avanzada, documentos, dashboards ejecutivos complejos, permisos avanzados e IA generativa quedan para fases futuras.

## 3. Estado actual del sistema

La app actual es una aplicacion web estatica basada en:

- `index.html`
- `style.css`
- `script.js`
- Leaflet
- `municipios.json`
- `partidos.geojson`

Hoy permite:

- Mostrar un mapa de municipios de Buenos Aires.
- Cargar marcadores desde `municipios.json`.
- Diferenciar visualmente clientes y prospectos.
- Filtrar por estado, nombre, poblacion, partido politico y seccion electoral.
- Ver una ficha lateral con informacion del municipio seleccionado.
- Ver una lista de resultados clickeables luego de filtrar.

El archivo `municipios.json` funciona como fuente principal de datos. El archivo `partidos.geojson` existe y contiene poligonos, pero todavia no esta integrado al flujo principal de visualizacion.

## 4. Problemas actuales

Los principales problemas son:

- La estructura esta concentrada en pocos archivos.
- Hay HTML, CSS y JavaScript demasiado acoplados.
- La logica de mapa, filtros, tarjetas y carga de datos vive junta o demasiado cerca.
- La informacion comercial esta mezclada con datos geograficos y datos institucionales.
- Editar datos requiere modificar `municipios.json` manualmente.
- No hay validaciones para evitar errores de carga o campos incompletos.
- No hay historial de cambios ni seguimiento comercial.
- La interfaz cumple su funcion, pero todavia se ve basica para uso comercial diario.
- El panel de detalle puede crecer demasiado si se agregan mas campos sin ordenarlos.
- Los filtros funcionan, pero podrian ser mas claros, rapidos y utiles.
- Hay dependencia de recursos externos por CDN para Leaflet, tiles e iconos.
- No existe separacion entre datos base del municipio y datos propios de Alertatel.
- No hay una forma comoda de registrar notas, prioridad, proxima accion o seguimiento.

## 5. Decision tecnica: refactor evolutivo, no reescritura desde cero

La decision tecnica recomendada es evolucionar la app actual por etapas, manteniendo lo que ya funciona.

No conviene reescribir todo desde cero ahora porque:

- La app actual ya resuelve el caso principal: ver municipios en un mapa.
- Leaflet es una buena eleccion para este tipo de herramienta.
- El volumen de datos es chico y manejable.
- Todavia no hace falta una arquitectura grande.
- El objetivo inmediato es mejorar utilidad interna, no construir una plataforma compleja.

La evolucion propuesta es:

1. Reestructurar la base del proyecto sin cambiar comportamiento.
2. Mejorar tarjetas, panel lateral y experiencia de uso.
3. Definir un modelo de datos mas claro.
4. Migrar gradualmente de JSON a SQLite.
5. Agregar una pantalla de administracion simple.
6. Incorporar vista de tareas y seguimiento comercial.
7. Dejar IA y datos dinamicos para una etapa final.

## 6. Fase 0: Reestructuracion base del proyecto

Objetivo: ordenar el arbol de carpetas y separar correctamente HTML, CSS y JavaScript, manteniendo intacta la logica actual de mapa y filtros.

Esta fase es previa a cualquier cambio funcional importante. La primera reestructuracion debe ser conservadora: mover y separar, no redisenar todo.

Objetivos concretos:

- Ordenar el arbol de carpetas.
- Separar correctamente HTML, CSS y JavaScript.
- Eliminar CSS inline de `index.html`.
- Preparar la app para que mas adelante pueda usar HTML dinamico o templates.
- Mantener intacta la logica actual de mapa y filtros.
- Dejar la estructura preparada para futuras pantallas o secciones, por ejemplo una vista de tareas.
- Evitar que todo siga creciendo dentro de un unico `script.js`.

Estructura sugerida:

```txt
/public
  index.html

/src
  /styles
    main.css
  /scripts
    app.js
    map.js
    filters.js
    cards.js
    data.js
  /components
    municipalityCard.js
    sidePanel.js
    summaryPanel.js
  /views
    mapView.js
    tasksView.js

/data
  municipios.json
  municipios.xlsx

/docs
  PLAN_V2.md
```

Aclaraciones:

- `/data` debe seguir ignorado por Git.
- `municipios.json` tambien debe seguir ignorado por Git mientras tenga datos sensibles.
- No se debe perder el mapa actual.
- No se deben perder los filtros actuales.
- No se debe implementar backend, SQLite ni IA en esta fase.
- Las tarjetas pueden quedar preparadas para ser reescritas despues, pero sin cambiar su comportamiento principal todavia.
- La app debe quedar lista para sumar una nueva seccion de tareas sin mezclar esa logica con mapa y filtros.

Separacion inicial recomendada:

- `app.js`: punto de entrada de la aplicacion.
- `map.js`: inicializacion de Leaflet, marcadores y comportamiento de mapa.
- `filters.js`: lectura de filtros y aplicacion sobre la lista de municipios.
- `cards.js`: render de ficha o tarjeta de municipio.
- `data.js`: carga de datos desde `municipios.json`.
- `municipalityCard.js`: componente futuro para la ficha comercial.
- `sidePanel.js`: estructura del panel lateral.
- `summaryPanel.js`: resumen de resultados y metricas.
- `mapView.js`: vista principal del mapa.
- `tasksView.js`: placeholder futuro para tareas y seguimiento.

Resultado esperado: misma app funcional, pero con una base ordenada para crecer sin mezclar responsabilidades.

## 7. Fase 1: Mejoras visuales de tarjetas, panel lateral y experiencia de uso

Objetivo: mejorar la experiencia visual y la lectura de la informacion sin cambiar la arquitectura de datos.

Acciones recomendadas:

- Ordenar el panel lateral en secciones claras.
- Mejorar la ficha del municipio con bloques como:
  - Datos generales.
  - Estado comercial.
  - Contacto.
  - Sistema actual.
  - Informacion economica/comercial.
  - Notas.
- Mejorar los colores de cliente/prospecto para que sean consistentes y sobrios.
- Agregar contador visible de resultados filtrados.
- Agregar resumen rapido:
  - cantidad de clientes;
  - cantidad de prospectos;
  - poblacion total filtrada;
  - total estimado de botones;
  - facturacion total de clientes, si el dato esta disponible.
- Ordenar la lista lateral por nombre y permitir luego ordenar por poblacion o prioridad.
- Integrar los poligonos de `partidos.geojson` de forma opcional, sin reemplazar los marcadores.
- Mejorar el comportamiento al seleccionar un resultado:
  - centrar mapa;
  - abrir ficha;
  - destacar marcador o poligono seleccionado.

Resultado esperado: una app igual de simple, pero mas clara, presentable y util para trabajo comercial.

## 8. Fase 2: Normalizacion del modelo de datos

Objetivo: ordenar los campos antes de migrar a base de datos.

Conviene separar conceptualmente los datos en grupos:

- Datos base del municipio:
  - nombre;
  - provincia;
  - departamento;
  - poblacion;
  - localidades;
  - latitud;
  - longitud;
  - seccion electoral;
  - sitio web oficial.

- Datos institucionales:
  - intendente;
  - partido politico;
  - telefono municipal;
  - direccion postal;
  - perfil economico;
  - parques industriales;
  - fiestas locales.

- Datos comerciales de Alertatel:
  - estado: cliente, prospecto, descartado, pendiente u otro;
  - cantidad de botones;
  - monto que pagan;
  - fecha de inicio;
  - sistema actual;
  - contacto principal;
  - telefono de contacto;
  - email, si se incorpora;
  - prioridad comercial;
  - proxima accion;
  - fecha de proxima accion;
  - responsable interno;
  - notas.

- Datos de seguimiento:
  - historial de contactos;
  - cambios de estado;
  - comentarios;
  - oportunidades;
  - objeciones;
  - tareas pendientes.

Antes de pasar a SQLite, se recomienda definir nombres de campos consistentes, sin mezclar mayusculas, acentos y espacios en claves tecnicas. Por ejemplo, usar `cantidad_botones` en vez de `Cantidad de botones`.

## 9. Fase 3: Migracion progresiva desde municipios.json a SQLite

Objetivo: dejar de depender de edicion manual de JSON y preparar una base local simple.

La opcion recomendada es incorporar:

- Node.js
- Express
- SQLite

Al principio, el frontend puede seguir siendo muy parecido. La diferencia es que en vez de hacer:

```js
fetch("municipios.json")
```

pasaria a consumir un endpoint local, por ejemplo:

```txt
GET /api/municipios
```

Modelo inicial sugerido:

- Tabla `municipios`
- Tabla `municipio_comercial`
- Tabla `notas`
- Tabla `historial`

No hace falta crear muchas tablas desde el primer dia. Se puede empezar con `municipios` y algunos campos comerciales, y separar mas adelante si aparece necesidad real.

Pasos recomendados:

1. Crear script de importacion desde `municipios.json` hacia SQLite.
2. Crear endpoint `GET /api/municipios`.
3. Hacer que el frontend lea desde el endpoint.
4. Mantener `municipios.json` como respaldo temporal.
5. Agregar endpoints de actualizacion recien cuando el modelo este estable.

Resultado esperado: misma app visual, pero con datos servidos desde una base local.

## 10. Fase 4: Pantalla/admin para editar municipios

Objetivo: permitir editar informacion sin tocar archivos manualmente.

La pantalla de administracion debe ser simple y orientada a uso interno.

Funciones iniciales:

- Buscar municipio.
- Abrir ficha editable.
- Editar campos comerciales:
  - estado;
  - cantidad de botones;
  - monto que pagan;
  - sistema actual;
  - contacto;
  - telefono;
  - web;
  - notas;
  - prioridad;
  - proxima accion.
- Guardar cambios.
- Ver fecha de ultima modificacion.

No hace falta implementar usuarios, permisos complejos ni auditoria avanzada al principio. Si el uso crece, se puede agregar autenticacion simple mas adelante.

Resultado esperado: Alertatel puede mantener sus datos comerciales actualizados desde una interfaz.

## 11. Fase 5: Vista de tareas y seguimiento comercial

Objetivo: transformar el mapa en una herramienta de seguimiento comercial, no solo de visualizacion.

La vista de tareas debe convivir con la vista de mapa, no reemplazarla. La Fase 0 debe haber dejado preparada la estructura para sumar `tasksView.js` sin mezclar tareas, mapa, filtros y tarjetas en un solo archivo.

La prioridad de esta fase es construir el modo ejecución:

- checklist diario;
- revisión semanal;
- revisión mensual estilo OKR;
- tareas vencidas y pendientes;
- avances por cuenta;
- prioridades comerciales.

Campos y funciones utiles:

- Prioridad comercial:
  - alta;
  - media;
  - baja.

- Estado comercial mas detallado:
  - cliente;
  - prospecto;
  - contacto iniciado;
  - reunion pendiente;
  - propuesta enviada;
  - negociacion;
  - descartado;
  - sin datos.

- Proxima accion:
  - llamar;
  - enviar propuesta;
  - pedir contacto;
  - coordinar reunion;
  - hacer seguimiento;
  - actualizar datos.

- Fecha de proxima accion.
- Responsable interno.
- Notas libres.
- Historial de contactos.
- Motivo de descarte.
- Sistema que usan actualmente.
- Nivel estimado de oportunidad.
- Cantidad potencial de botones.
- Facturacion potencial estimada.

Mejoras visuales:

- Vista de tareas filtrable por fecha, prioridad, responsable y estado.
- Colorear municipios por estado comercial.
- Permitir filtrar por prioridad.
- Mostrar alertas de acciones vencidas.
- Mostrar resumen de oportunidades.
- Crear vista de lista comercial, ademas del mapa.

Resultado esperado: el equipo puede usar la app para decidir donde accionar comercialmente y que tareas seguir.

## 12. Fase 6: Integracion futura con IA y datos dinamicos

Objetivo: sumar inteligencia y datos externos solo cuando la base interna ya este ordenada.

Ideas futuras:

- Señales comerciales automáticas por noticias.
- Señales por cambios institucionales.
- Señales por falta de seguimiento.
- Señales por patrones de datos.
- Oportunidades detectadas automáticamente.
- Resumen automático de cada municipio.
- Sugerencia de prioridad comercial.
- Detección de municipios parecidos a clientes actuales.
- Generación de notas o mensajes comerciales.
- Enriquecimiento con datos públicos.
- Alertas por cambios de intendente, web municipal o noticias relevantes.
- Análisis de oportunidades por población, zona, partido político, sistema actual y comportamiento histórico.

Esta fase debe esperar hasta que:

- Los datos internos esten normalizados.
- Exista SQLite funcionando.
- Haya una pantalla de edicion.
- El seguimiento comercial tenga uso real.

La IA no debe reemplazar la carga ordenada de datos. Debe ayudar sobre una base confiable.

## 13. Riesgos

Riesgos principales:

- Intentar hacer demasiadas cosas juntas y romper lo que ya funciona.
- Convertir la Fase 0 en un rediseño funcional encubierto.
- Mover archivos y perder rutas de carga de CSS, JS o datos.
- Migrar a base de datos antes de ordenar el modelo.
- Crear un admin demasiado complejo para una necesidad interna simple.
- Agregar IA antes de tener datos confiables.
- Mezclar datos geograficos, institucionales y comerciales sin criterio.
- No definir estados comerciales claros.
- Depender de ediciones manuales sin validacion.
- Perder trazabilidad de cambios importantes.

Mitigacion:

- Avanzar por fases chicas.
- Mantener siempre una version funcional.
- Verificar mapa y filtros despues de cada reestructuracion.
- Hacer respaldos del JSON antes de importar a SQLite.
- Validar campos clave.
- Priorizar uso comercial real sobre funciones decorativas.

## 14. Orden recomendado de implementacion

Orden sugerido:

1. Crear estructura base de carpetas.
2. Mover `index.html` a `/public`.
3. Mover estilos a `/src/styles/main.css`.
4. Separar JavaScript actual en modulos chicos sin cambiar comportamiento.
5. Mantener `/data` ignorado por Git y conservar `municipios.json` fuera del repositorio si contiene datos sensibles.
6. Verificar que mapa, filtros, lista y ficha sigan funcionando.
7. Mejorar la ficha visual del municipio.
8. Mejorar panel lateral, resumen comercial y filtros.
9. Integrar poligonos de forma opcional.
10. Definir modelo de datos normalizado.
11. Crear script de migracion desde JSON a SQLite.
12. Crear backend local con Node/Express.
13. Cambiar el frontend para consumir `GET /api/municipios`.
14. Agregar edicion basica de datos comerciales.
15. Agregar vista de tareas, notas y seguimiento.
16. Agregar prioridad, proxima accion e historial.
17. Evaluar IA y datos externos.

## 15. Que NO hacer todavia

Por ahora no conviene:

- Rehacer la app completa desde cero.
- Pasar a React, Vue u otro framework sin una necesidad clara.
- Rediseñar toda la interfaz durante la Fase 0.
- Implementar backend durante la Fase 0.
- Implementar SQLite durante la Fase 0.
- Agregar IA durante la Fase 0.
- Crear un sistema grande de usuarios y permisos.
- Diseñar una arquitectura empresarial.
- Agregar IA antes de ordenar los datos.
- Conectar muchas fuentes externas desde el inicio.
- Reemplazar Leaflet si ya resuelve bien el mapa.
- Eliminar `municipios.json` hasta que SQLite este probado.
- Sacar `municipios.json` de `.gitignore` mientras tenga datos sensibles.
- Crear demasiadas tablas antes de entender el uso real.
- Automatizar decisiones comerciales sin validacion humana.

La prioridad es evolucionar la herramienta actual para que sea mas clara, editable y util para el trabajo comercial diario de Alertatel.
