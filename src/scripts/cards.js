export function renderInitialState(infoContent, listaResultados) {
  listaResultados.innerHTML = "";
  infoContent.innerHTML = `
    <div class="empty-state">
      <h3>Selecciona un municipio</h3>
      <p>La ficha de trabajo se va a mostrar aca con datos comerciales, contacto, contexto institucional y acciones futuras.</p>
    </div>
  `;
}

export function renderFichaLoading(infoContent, municipio) {
  infoContent.innerHTML = `
    <div class="empty-state">
      <h3>Cargando ficha</h3>
      <p>Consultando datos comerciales de ${escapeHtml(valueOrDash(municipio.nombre))}.</p>
    </div>
  `;
}

export function renderFichaError(infoContent, error) {
  infoContent.innerHTML = `
    <div class="load-error-state">
      <h3>No se pudo cargar la ficha</h3>
      <p>${escapeHtml(error.message)}</p>
    </div>
  `;
}

function valueOrDash(value) {
  return value !== undefined && value !== null && value !== "" ? value : "-";
}

function valueOrEmpty(value) {
  return value !== undefined && value !== null ? value : "";
}

function escapeHtml(value) {
  return String(valueOrEmpty(value))
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function moneyOrDash(value) {
  return value !== undefined && value !== null && value !== "" ? `$${value}` : "-";
}

function websiteHref(value) {
  if (!value) {
    return "#";
  }

  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

function statusClass(estado) {
  return estado === "Cliente" ? "cliente" : "prospecto";
}

function statusDescription(estado) {
  return estado === "Cliente" ? "Cuenta activa en Alertatel" : "Cuenta pendiente de desarrollo comercial";
}

function currentStatus(m) {
  return valueOrDash(m.comercial?.estado_comercial || m.estado);
}

function currentPriority(m) {
  return valueOrDash(m.comercial?.prioridad);
}

function currentNextAction(m) {
  const nextAction = valueOrDash(m.comercial?.proxima_accion);
  return nextAction === "-" ? "Sin proxima accion registrada" : nextAction;
}

function currentNextActionDate(m) {
  return valueOrDash(m.comercial?.fecha_proxima_accion);
}

function currentMainContact(m) {
  return valueOrDash(m.contacto);
}

function currentProducts(m) {
  const system = valueOrDash(m.comercial?.servicio || m.comercial?.sistema_actual || m.sistema);
  const buttons = valueOrDash(m["Cantidad de botones"]);

  if (system === "-" && buttons === "-") {
    return "Sin producto o sistema registrado";
  }

  if (buttons === "-") {
    return system;
  }

  return `${system} - ${buttons} botones`;
}

function yesNoOrDash(value) {
  if (value === true) {
    return "Sí";
  }

  if (value === false) {
    return "No";
  }

  return "-";
}

function selectedValue(current, value) {
  return current === value ? "selected" : "";
}

function renderCommercialView(m) {
  return `
    <div class="tracking-summary">
      <div class="tracking-item">
        <span>Estado comercial</span>
        <strong>${escapeHtml(currentStatus(m))}</strong>
      </div>
      <div class="tracking-item">
        <span>Prioridad</span>
        <strong>${escapeHtml(currentPriority(m))}</strong>
      </div>
      <div class="tracking-item tracking-item--wide">
        <span>Proxima accion</span>
        <strong>${escapeHtml(currentNextAction(m))}</strong>
      </div>
      <div class="tracking-item">
        <span>Fecha proxima accion</span>
        <strong>${escapeHtml(currentNextActionDate(m))}</strong>
      </div>
      <div class="tracking-item">
        <span>Contacto principal</span>
        <strong>${escapeHtml(currentMainContact(m))}</strong>
      </div>
      <div class="tracking-item">
        <span>Servicio</span>
        <strong>${escapeHtml(currentProducts(m))}</strong>
      </div>
      <div class="tracking-item">
        <span>Clasificación</span>
        <strong>${escapeHtml(valueOrDash(m.comercial?.clasificacion))}</strong>
      </div>
      <div class="tracking-item">
        <span>Subclasificación</span>
        <strong>${escapeHtml(valueOrDash(m.comercial?.subclasificacion))}</strong>
      </div>
      <div class="tracking-item">
        <span>Ojos en Alerta</span>
        <strong>${escapeHtml(yesNoOrDash(m.comercial?.ojos_en_alerta))}</strong>
      </div>
      <div class="tracking-item tracking-item--wide">
        <span>Notas</span>
        <strong>${escapeHtml(valueOrDash(m.comercial?.notas))}</strong>
      </div>
    </div>
  `;
}

function selectedPriority(comercial, value) {
  return comercial.prioridad === value ? "selected" : "";
}

function renderCommercialForm(m, options) {
  const comercial = m.comercial || {};
  const disabled = options.isSaving ? "disabled" : "";

  return `
    <form class="commercial-form" id="commercial-edit-form">
      ${options.error ? `<div class="form-error">${escapeHtml(options.error.message)}</div>` : ""}

      <div class="form-grid">
        <label>
          <span>Clasificación</span>
          <select name="clasificacion" ${disabled}>
            <option value="">Sin clasificar</option>
            <option value="Cliente" ${selectedValue(comercial.clasificacion, "Cliente")}>Cliente</option>
            <option value="No cliente" ${selectedValue(comercial.clasificacion, "No cliente")}>No cliente</option>
          </select>
        </label>

        <label>
          <span>Subclasificación</span>
          <select name="subclasificacion" ${disabled}>
            <option value="">Sin subclasificación</option>
            <option value="Prospecto" ${selectedValue(comercial.subclasificacion, "Prospecto")}>Prospecto</option>
          </select>
        </label>

        <label>
          <span>Servicio</span>
          <input name="servicio" type="text" list="service-options" value="${escapeHtml(comercial.servicio)}" placeholder="Ej: Alertatel o SoftGuard" ${disabled}>
          <datalist id="service-options">
            <option value="Alertatel"></option>
            <option value="SoftGuard"></option>
          </datalist>
        </label>

        <label>
          <span>Ojos en Alerta</span>
          <select name="ojos_en_alerta" ${disabled}>
            <option value="" ${selectedValue(comercial.ojos_en_alerta, null)}>Sin informar</option>
            <option value="true" ${selectedValue(comercial.ojos_en_alerta, true)}>Sí</option>
            <option value="false" ${selectedValue(comercial.ojos_en_alerta, false)}>No</option>
          </select>
        </label>

        <label>
          <span>Estado comercial</span>
          <input name="estado_comercial" type="text" value="${escapeHtml(comercial.estado_comercial)}" placeholder="Ej: contacto iniciado" ${disabled}>
        </label>

        <label>
          <span>Prioridad</span>
          <select name="prioridad" ${disabled}>
            <option value="">Sin prioridad</option>
            <option value="alta" ${selectedPriority(comercial, "alta")}>Alta</option>
            <option value="media" ${selectedPriority(comercial, "media")}>Media</option>
            <option value="baja" ${selectedPriority(comercial, "baja")}>Baja</option>
          </select>
        </label>

        <label class="form-field--wide">
          <span>Proxima accion</span>
          <input name="proxima_accion" type="text" value="${escapeHtml(comercial.proxima_accion)}" placeholder="Ej: llamar para coordinar reunion" ${disabled}>
        </label>

        <label>
          <span>Fecha proxima accion</span>
          <input name="fecha_proxima_accion" type="date" value="${escapeHtml(comercial.fecha_proxima_accion)}" ${disabled}>
        </label>

        <label>
          <span>Sistema actual</span>
          <input name="sistema_actual" type="text" value="${escapeHtml(comercial.sistema_actual)}" placeholder="Sistema usado actualmente" ${disabled}>
        </label>

        <label class="form-field--wide">
          <span>Notas</span>
          <textarea name="notas" rows="5" placeholder="Notas comerciales internas" ${disabled}>${escapeHtml(comercial.notas)}</textarea>
        </label>
      </div>

      <div class="form-actions">
        <button class="secondary-action" type="button" id="commercial-cancel-button" ${disabled}>Cancelar</button>
        <button class="primary-action" type="submit" ${disabled}>${options.isSaving ? "Guardando..." : "Guardar"}</button>
      </div>
    </form>
  `;
}

function collectCommercialPayload(form) {
  const formData = new FormData(form);
  const payload = {};

  for (const [key, value] of formData.entries()) {
    const text = String(value).trim();
    payload[key] =
      key === "ojos_en_alerta"
        ? text === "" ? null : text === "true"
        : text === "" ? null : text;
  }

  return payload;
}

function taskPriorityLabel(prioridad) {
  const labels = {
    alta: "Alta",
    media: "Media",
    baja: "Baja"
  };

  return labels[prioridad] || "Media";
}

function taskStatusLabel(task) {
  if (task.estado === "completada") {
    return "Realizada";
  }

  return task.fecha && task.fecha < new Date().toISOString().slice(0, 10) ? "Vencida" : "Pendiente";
}

function renderTaskList(tasks, emptyText) {
  if (!tasks.length) {
    return `<div class="municipality-task-empty">${escapeHtml(emptyText)}</div>`;
  }

  return tasks
    .map(
      (task) => `
        <div class="municipality-task ${task.estado === "completada" ? "municipality-task--done" : ""}">
          <div class="municipality-task__main">
            <div class="municipality-task__meta">
              <span>${escapeHtml(taskStatusLabel(task))}</span>
              <span>${escapeHtml(taskPriorityLabel(task.prioridad))}</span>
              <span>${escapeHtml(valueOrDash(task.fecha))}</span>
            </div>
            <strong>${escapeHtml(task.titulo)}</strong>
            ${task.descripcion ? `<p>${escapeHtml(task.descripcion)}</p>` : ""}
          </div>
          <button class="secondary-action" type="button" data-municipality-task-id="${escapeHtml(task.id)}" data-task-completed="${task.estado === "completada"}">
            ${task.estado === "completada" ? "Reactivar" : "Completar"}
          </button>
        </div>
      `
    )
    .join("");
}

function renderMunicipalityTasks(tasks, options) {
  const pendingTasks = tasks.filter((task) => task.estado !== "completada");
  const completedTasks = tasks.filter((task) => task.estado === "completada");

  return `
    <form class="municipality-task-form" id="municipality-task-form">
      ${options.taskError ? `<div class="form-error">${escapeHtml(options.taskError.message)}</div>` : ""}
      <label class="municipality-task-form__title">
        <span>Tarea</span>
        <input name="titulo" type="text" placeholder="Nueva tarea para este municipio" required>
      </label>
      <label>
        <span>Fecha</span>
        <input name="fecha" type="date" value="${escapeHtml(new Date().toISOString().slice(0, 10))}">
      </label>
      <label>
        <span>Prioridad</span>
        <select name="prioridad">
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="baja">Baja</option>
        </select>
      </label>
      <label class="municipality-task-form__description">
        <span>Descripcion</span>
        <input name="descripcion" type="text" placeholder="Detalle opcional">
      </label>
      <button class="primary-action" type="submit">Agregar tarea</button>
    </form>

    <div class="municipality-task-columns">
      <div>
        <h4>Por realizar</h4>
        <div class="municipality-task-list">
          ${renderTaskList(pendingTasks, "No hay tareas pendientes para este municipio.")}
        </div>
      </div>
      <div>
        <h4>Realizadas</h4>
        <div class="municipality-task-list">
          ${renderTaskList(completedTasks, "No hay tareas realizadas para este municipio.")}
        </div>
      </div>
    </div>
  `;
}

function collectTaskPayload(form) {
  const formData = new FormData(form);

  return {
    titulo: String(formData.get("titulo") || "").trim(),
    descripcion: String(formData.get("descripcion") || "").trim() || null,
    fecha: String(formData.get("fecha") || "").trim() || new Date().toISOString().slice(0, 10),
    prioridad: String(formData.get("prioridad") || "media")
  };
}

export function renderInfoPanel(infoContent, m, options = {}) {
  const renderOptions = {
    mode: "view",
    isSaving: false,
    error: null,
    taskError: null,
    tasks: [],
    onEdit: null,
    onCancel: null,
    onSave: null,
    onTaskCreate: null,
    onTaskToggle: null,
    ...options
  };
  const isEditing = renderOptions.mode === "edit";

  infoContent.innerHTML = `
    <article class="municipality-card">
      <header class="municipality-card__header">
        <div class="municipality-card__identity">
          <p class="municipality-card__eyebrow">Cuenta municipal</p>
          <h2 class="municipality-card__title">${escapeHtml(m.nombre)}</h2>
          <p class="municipality-card__subtitle">${escapeHtml(valueOrDash(m.Provincia))} - Seccion ${escapeHtml(valueOrDash(m.seccionelectoral))}</p>
          <p class="municipality-card__status-note">${escapeHtml(statusDescription(m.estado))}</p>
        </div>
        <span class="municipality-card__status status-badge status-badge--${statusClass(m.estado)}">${escapeHtml(valueOrDash(m.estado))}</span>
      </header>

      <section class="municipality-card__section municipality-card__section--tracking">
        <div class="section-title-row">
          <div>
            <p class="municipality-card__eyebrow">Ejecucion comercial</p>
            <h3>Seguimiento comercial</h3>
          </div>
          ${
            isEditing
              ? `<span class="section-chip">Editando</span>`
              : `<button class="primary-action" type="button" id="commercial-edit-button">Editar</button>`
          }
        </div>
        ${isEditing ? renderCommercialForm(m, renderOptions) : renderCommercialView(m)}
      </section>

      <section class="municipality-card__section municipality-card__section--highlight">
        <div class="section-title-row">
          <div>
            <p class="municipality-card__eyebrow">Datos de Alertatel</p>
            <h3>Resumen comercial</h3>
          </div>
          <span class="section-chip">Prioridad ${escapeHtml(currentPriority(m))}</span>
        </div>
        <div class="metric-grid">
          <div class="metric-card">
            <span>Cantidad de botones</span>
            <strong>${escapeHtml(valueOrDash(m["Cantidad de botones"]))}</strong>
          </div>
          <div class="metric-card">
            <span>Pagan</span>
            <strong>${escapeHtml(moneyOrDash(m.Pagan))}</strong>
          </div>
          <div class="metric-card">
            <span>Servicio</span>
            <strong>${escapeHtml(valueOrDash(m.comercial?.servicio || m.comercial?.sistema_actual || m.sistema))}</strong>
          </div>
          <div class="metric-card">
            <span>Fecha inicio</span>
            <strong>${escapeHtml(valueOrDash(m["Fecha inicio"]))}</strong>
          </div>
        </div>
        <div class="next-action-placeholder">
          <span>Proxima accion</span>
          <strong>${escapeHtml(currentNextAction(m))}</strong>
        </div>
      </section>

      <section class="municipality-card__section">
        <h3>Contacto comercial y canales</h3>
        <div class="info-grid">
          <div class="info-item info-item--wide"><span>Contacto principal</span><strong>${escapeHtml(valueOrDash(m.contacto))}</strong></div>
          <div class="info-item"><span>Telefono de contacto</span><strong>${escapeHtml(valueOrDash(m.telefono))}</strong></div>
          <div class="info-item"><span>Telefono municipal</span><strong>${escapeHtml(valueOrDash(m.telefonoGobierno))}</strong></div>
          <div class="info-item info-item--wide">
            <span>Sitio web</span>
            <strong><a href="${escapeHtml(websiteHref(m["Sitio Web"]))}" target="_blank" rel="noopener noreferrer">${escapeHtml(valueOrDash(m["Sitio Web"]))}</a></strong>
          </div>
        </div>
      </section>

      <section class="municipality-card__section">
        <div class="section-title-row">
          <div>
            <p class="municipality-card__eyebrow">Datos publicos</p>
            <h3>Institucional y territorio</h3>
          </div>
          <span class="section-chip">Fuente externa/manual</span>
        </div>
        <div class="info-grid">
          <div class="info-item"><span>Intendente</span><strong>${escapeHtml(valueOrDash(m.intendente))}</strong></div>
          <div class="info-item"><span>Partido politico</span><strong>${escapeHtml(valueOrDash(m.politico))}</strong></div>
          <div class="info-item"><span>Poblacion</span><strong>${escapeHtml(valueOrDash(m.poblacion))}</strong></div>
          <div class="info-item"><span>Categoria</span><strong>${escapeHtml(valueOrDash(m["Categoría de Gobierno"] || m["CategorÃ­a de Gobierno"]))}</strong></div>
          <div class="info-item"><span>Departamento</span><strong>${escapeHtml(valueOrDash(m.Departamento))}</strong></div>
          <div class="info-item"><span>Distancia a capital</span><strong>${escapeHtml(valueOrDash(m["Distancia a la capital provincial"]))}</strong></div>
          <div class="info-item"><span>Perfil economico</span><strong>${escapeHtml(valueOrDash(m["Perfil económico de la región"] || m["Perfil econÃ³mico de la regiÃ³n"]))}</strong></div>
          <div class="info-item"><span>Parques industriales</span><strong>${escapeHtml(valueOrDash(m["Cantidad de Parques Industriales RENPI"]))}</strong></div>
          <div class="info-item info-item--wide"><span>Localidades</span><strong>${escapeHtml(valueOrDash(m.localidades))}</strong></div>
          <div class="info-item info-item--wide"><span>Direccion postal</span><strong>${escapeHtml(valueOrDash(m["Dirección postal de la sede de Gobierno"] || m["DirecciÃ³n postal de la sede de Gobierno"]))}</strong></div>
        </div>
      </section>

      <section class="municipality-card__section">
        <h3>Contexto publico disponible</h3>
        <div class="info-grid">
          <div class="info-item"><span>Incendios 1999-2022</span><strong>${escapeHtml(valueOrDash(m["Incendios reportados en el período 1999-2022"] || m["Incendios reportados en el perÃ­odo 1999-2022"]))}</strong></div>
          <div class="info-item"><span>Inundaciones 1999-2022</span><strong>${escapeHtml(valueOrDash(m["Inundaciones reportadas en el período 1999-2022"] || m["Inundaciones reportadas en el perÃ­odo 1999-2022"]))}</strong></div>
          <div class="info-item"><span>Latitud</span><strong>${escapeHtml(valueOrDash(m.lat))}</strong></div>
          <div class="info-item"><span>Longitud</span><strong>${escapeHtml(valueOrDash(m.long))}</strong></div>
          <div class="info-item info-item--wide"><span>Fiestas locales</span><strong>${escapeHtml(valueOrDash(m["Fiestas locales"]))}</strong></div>
        </div>
      </section>

      <section class="municipality-card__section">
        <div class="section-title-row">
          <div>
            <p class="municipality-card__eyebrow">Tareas vinculadas</p>
            <h3>Trabajo comercial pendiente</h3>
          </div>
          <span class="section-chip">${escapeHtml(String(renderOptions.tasks.length))} tareas</span>
        </div>
        ${renderMunicipalityTasks(renderOptions.tasks, renderOptions)}
      </section>
    </article>
  `;

  const editButton = infoContent.querySelector("#commercial-edit-button");
  editButton?.addEventListener("click", () => renderOptions.onEdit?.());

  const cancelButton = infoContent.querySelector("#commercial-cancel-button");
  cancelButton?.addEventListener("click", () => renderOptions.onCancel?.());

  const form = infoContent.querySelector("#commercial-edit-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    renderOptions.onSave?.(collectCommercialPayload(form));
  });

  const taskForm = infoContent.querySelector("#municipality-task-form");
  taskForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    renderOptions.onTaskCreate?.(collectTaskPayload(taskForm));
  });

  infoContent.querySelectorAll("[data-municipality-task-id]").forEach((button) => {
    button.addEventListener("click", () => {
      renderOptions.onTaskToggle?.(button.dataset.municipalityTaskId, button.dataset.taskCompleted !== "true");
    });
  });
}

export function renderListaResultados(listaResultados, lista, onSelectMunicipio) {
  listaResultados.innerHTML = "";

  if (lista.length === 0) {
    listaResultados.innerHTML = `
      <div class="empty-state">
        <h3>Sin resultados</h3>
        <p>No se encontraron municipios con los filtros actuales.</p>
      </div>
    `;
    return;
  }

  lista.forEach(m => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "municipality-list-item";
    item.innerHTML = `
      <span>
        <span class="municipality-list-item__name">${escapeHtml(m.nombre)}</span>
        <span class="municipality-list-item__meta">Seccion ${escapeHtml(valueOrDash(m.seccionelectoral))} - ${escapeHtml(valueOrDash(m.poblacion))} hab.</span>
      </span>
      <span class="status-badge status-badge--${statusClass(m.estado)}">${escapeHtml(valueOrDash(m.estado))}</span>
    `;

    item.addEventListener("click", () => {
      onSelectMunicipio(m);
      listaResultados.innerHTML = "";
    });

    listaResultados.appendChild(item);
  });
}

export function renderFilterCount(infoContent, count) {
  infoContent.innerHTML = `
    <div class="filter-count-state">
      <h3>${count} municipios encontrados</h3>
      <p>Selecciona un resultado de la lista o un marcador del mapa para abrir la ficha comercial.</p>
    </div>
  `;
}

export function renderLoadError(infoContent, listaResultados, error) {
  listaResultados.innerHTML = "";
  infoContent.innerHTML = `
    <div class="load-error-state">
      <h3>No se pudieron cargar los municipios</h3>
      <p>${escapeHtml(error.message)}</p>
    </div>
  `;
}
