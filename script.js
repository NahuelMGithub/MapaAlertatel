const infoContent = document.getElementById("info-content");
const estadoFilter = document.getElementById("estado-filter");
const nombreFilter = document.getElementById("nombre-filter");
const pobMinInput = document.getElementById("pob-min");
const pobMaxInput = document.getElementById("pob-max");
const applyFiltersBtn = document.getElementById("apply-filters");
const politicoFilter = document.getElementById("politico-filter");
const seccionelectoralFilter = document.getElementById("seccionelectoral-filter");

const listaResultados = document.getElementById("lista-resultados");

const map = L.map("map").setView([-36.5, -60.5], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
}).addTo(map);

let markers = [];
let municipiosData = [];

function crearIcono(color) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

// Cargar el JSON de municipios
fetch("municipios.json")
  .then(res => res.json())
  .then(data => {
    municipiosData = data;
    mostrarMarkers(municipiosData);
  });

function mostrarMarkers(lista) {
  // 🔑 Limpiar marcadores anteriores
  markers.forEach(m => map.removeLayer(m.marker));
  markers = [];

  lista.forEach(m => {
    const iconColor = m.estado === "Cliente" ? "green" : "blue";
    const marker = L.marker([m.lat, m.long], { icon: crearIcono(iconColor) }).addTo(map);
    marker.on("click", () => renderInfoPanel(m));
    markers.push({ marker, data: m });
  });
}

function renderInfoPanel(m) {
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

function renderListaResultados(lista) {
  listaResultados.innerHTML = ""; // limpio la lista
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
      map.flyTo([m.lat, m.long], 11, { duration: 1 });
      renderInfoPanel(m);
      listaResultados.innerHTML = ""; // 🔑 limpiar lista al seleccionar uno
    });

    listaResultados.appendChild(item);
  });
}

// Evento al hacer click en el botón de filtrar
applyFiltersBtn.addEventListener("click", () => {
  const estado = estadoFilter.value;
  const nombre = nombreFilter.value.toLowerCase();
  const pobMin = parseInt(pobMinInput.value) || 0;
  const pobMax = parseInt(pobMaxInput.value) || Infinity;
  const politico = politicoFilter.value.toLowerCase();
  const seccion = seccionelectoralFilter.value.toLowerCase();

  const filtrados = municipiosData.filter(m => {
    const poblacion = parseInt(String(m.poblacion).replace(/\./g, "")) || 0;
    const matchEstado = (estado === "todos" || m.estado === estado);
    const matchNombre = m.nombre.toLowerCase().includes(nombre);
    const matchPoblacion = poblacion >= pobMin && poblacion <= pobMax;
    const matchPolitico = m.politico ? m.politico.toLowerCase().includes(politico) : false;
    const matchSeccion = m.seccionelectoral ? m.seccionelectoral.toLowerCase().includes(seccion) : false;

    return matchEstado && matchNombre && matchPoblacion && matchPolitico && matchSeccion;
  });

  mostrarMarkers(filtrados);
  renderListaResultados(filtrados);
  infoContent.innerHTML = `<p>Se encontraron ${filtrados.length} municipios</p>`;
});

