export function renderInitialState(infoContent, listaResultados) {
  listaResultados.innerHTML = "";
  infoContent.innerHTML = "<p>Selecciona un municipio en el mapa</p>";
}

export function renderInfoPanel(infoContent, m) {
  infoContent.innerHTML = `
    <div class="info-item"><b>Municipio:</b> ${m.nombre}</div>
    <div class="info-item"><b>Intendente:</b> ${m.intendente || "-"}</div>
    <div class="info-item"><b>Partido Político:</b> ${m.politico || "-"}</div>
    <div class="info-item"><b>Sección Electoral:</b> ${m.seccionelectoral || "-"}</div>
    <div class="info-item"><b>Estado:</b> ${m.estado}</div>
    <div class="info-item"><b>Población:</b> ${m.poblacion}</div>
    <div class="info-item"><b>Localidades:</b> ${m.localidades}</div>
    <div class="info-item"><b>Distancia a capital:</b> ${m["Distancia a la capital provincial"]}</div>
    <div class="info-item"><b>Contacto:</b> ${m.contacto || "-"}</div>
    <div class="info-item"><b>Telefono de contacto:</b> ${m.telefono || "-"}</div>
    <div class="info-item"><b>Poseen Sistema:</b> ${m.sistema || "-"}</div>
    ${m.estado === "Cliente" ? `
      <div class="info-item"><b>Cantidad de botones:</b> ${m["Cantidad de botones"]}</div>
      <div class="info-item"><b>Pagan:</b> $${m.Pagan}</div>
    ` : ""}
    <div class="info-item"><b>Sitio web:</b> <a href="https://${m["Sitio Web"]}" target="_blank">${m["Sitio Web"]}</a></div>
    <div class="info-item"><b>Telefono de Municipio:</b> ${m.telefonoGobierno || "-"}</div>
  `;
}

export function renderListaResultados(listaResultados, lista, onSelectMunicipio) {
  listaResultados.innerHTML = "";

  if (lista.length === 0) {
    listaResultados.innerHTML = "<p>No se encontraron municipios</p>";
    return;
  }

  lista.forEach(m => {
    const item = document.createElement("div");
    item.textContent = m.nombre;
    item.style.cursor = "pointer";
    item.style.margin = "4px 0";
    item.style.padding = "4px 6px";
    item.style.borderRadius = "6px";
    item.style.backgroundColor = m.estado === "Cliente" ? "#4CAF50" : "#2196F3";
    item.style.color = "white";

    item.addEventListener("click", () => {
      onSelectMunicipio(m);
      listaResultados.innerHTML = "";
    });

    listaResultados.appendChild(item);
  });
}

export function renderFilterCount(infoContent, count) {
  infoContent.innerHTML = `<p>Se encontraron ${count} municipios</p>`;
}

export function renderLoadError(infoContent, listaResultados, error) {
  listaResultados.innerHTML = "";
  infoContent.innerHTML = `<p>No se pudieron cargar los municipios. ${error.message}</p>`;
}
