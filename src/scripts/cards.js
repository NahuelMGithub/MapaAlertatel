export function renderInitialState(infoContent, listaResultados) {
  listaResultados.innerHTML = "";
  infoContent.innerHTML = `
    <div class="empty-state">
      <h3>Selecciona un municipio</h3>
      <p>La ficha de trabajo se va a mostrar aca con datos comerciales, contacto, contexto institucional y acciones futuras.</p>
    </div>
  `;
}

function valueOrDash(value) {
  return value !== undefined && value !== null && value !== "" ? value : "-";
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

export function renderInfoPanel(infoContent, m) {
  infoContent.innerHTML = `
    <article class="municipality-card">
      <header class="municipality-card__header">
        <div>
          <p class="municipality-card__eyebrow">Municipio</p>
          <h2 class="municipality-card__title">${m.nombre}</h2>
          <p class="municipality-card__subtitle">${valueOrDash(m.Provincia)} · Sección ${valueOrDash(m.seccionelectoral)}</p>
        </div>
        <span class="municipality-card__status status-badge status-badge--${statusClass(m.estado)}">${valueOrDash(m.estado)}</span>
      </header>

      <section class="municipality-card__section">
        <h3>Datos políticos/institucionales</h3>
        <div class="info-grid">
          <div class="info-item"><span>Intendente</span><strong>${valueOrDash(m.intendente)}</strong></div>
          <div class="info-item"><span>Partido político</span><strong>${valueOrDash(m.politico)}</strong></div>
          <div class="info-item"><span>Población</span><strong>${valueOrDash(m.poblacion)}</strong></div>
          <div class="info-item info-item--wide"><span>Localidades</span><strong>${valueOrDash(m.localidades)}</strong></div>
        </div>
      </section>

      <section class="municipality-card__section">
        <h3>Datos comerciales</h3>
        <div class="info-grid">
          <div class="info-item"><span>Estado</span><strong>${valueOrDash(m.estado)}</strong></div>
          <div class="info-item"><span>Poseen sistema</span><strong>${valueOrDash(m.sistema)}</strong></div>
          <div class="info-item"><span>Fecha de inicio</span><strong>${valueOrDash(m["Fecha inicio"])}</strong></div>
          <div class="info-item"><span>Cantidad de botones</span><strong>${valueOrDash(m["Cantidad de botones"])}</strong></div>
          <div class="info-item"><span>Pagan</span><strong>${moneyOrDash(m.Pagan)}</strong></div>
        </div>
      </section>

      <section class="municipality-card__section">
        <h3>Contacto y web</h3>
        <div class="info-grid">
          <div class="info-item"><span>Contacto</span><strong>${valueOrDash(m.contacto)}</strong></div>
          <div class="info-item"><span>Teléfono de contacto</span><strong>${valueOrDash(m.telefono)}</strong></div>
          <div class="info-item"><span>Teléfono municipal</span><strong>${valueOrDash(m.telefonoGobierno)}</strong></div>
          <div class="info-item">
            <span>Sitio web</span>
            <strong><a href="${websiteHref(m["Sitio Web"])}" target="_blank" rel="noopener noreferrer">${valueOrDash(m["Sitio Web"])}</a></strong>
          </div>
        </div>
      </section>

      <section class="municipality-card__section">
        <h3>Observaciones y datos disponibles</h3>
        <div class="info-grid">
          <div class="info-item"><span>Distancia a capital</span><strong>${valueOrDash(m["Distancia a la capital provincial"])}</strong></div>
          <div class="info-item"><span>Perfil económico</span><strong>${valueOrDash(m["Perfil económico de la región"])}</strong></div>
          <div class="info-item"><span>Parques industriales</span><strong>${valueOrDash(m["Cantidad de Parques Industriales RENPI"])}</strong></div>
          <div class="info-item"><span>Incendios 1999-2022</span><strong>${valueOrDash(m["Incendios reportados en el período 1999-2022"])}</strong></div>
          <div class="info-item"><span>Inundaciones 1999-2022</span><strong>${valueOrDash(m["Inundaciones reportadas en el período 1999-2022"])}</strong></div>
          <div class="info-item info-item--wide"><span>Dirección postal</span><strong>${valueOrDash(m["Dirección postal de la sede de Gobierno"])}</strong></div>
        </div>
      </section>

      <section class="municipality-card__section">
        <h3>Acciones futuras</h3>
        <div class="future-actions">
          <button type="button" disabled>Preparar reunión</button>
          <button type="button" disabled>Agregar tarea</button>
          <button type="button" disabled>Ver actividades</button>
        </div>
      </section>
    </article>
  `;
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
        <span class="municipality-list-item__name">${m.nombre}</span>
        <span class="municipality-list-item__meta">Sección ${valueOrDash(m.seccionelectoral)} · ${valueOrDash(m.poblacion)} hab.</span>
      </span>
      <span class="status-badge status-badge--${statusClass(m.estado)}">${valueOrDash(m.estado)}</span>
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
      <p>${error.message}</p>
    </div>
  `;
}
