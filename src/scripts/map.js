let map;
let markers = [];

function getLeaflet() {
  if (!window.L) {
    throw new Error("Leaflet no esta disponible");
  }

  return window.L;
}

function crearIcono(color) {
  const L = getLeaflet();

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

export function initMap() {
  const L = getLeaflet();

  map = L.map("map").setView([-36.5, -60.5], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
  }).addTo(map);

  return map;
}

export function clearMarkers() {
  markers.forEach(m => map.removeLayer(m.marker));
  markers = [];
}

export function mostrarMarkers(lista, onSelectMunicipio) {
  const L = getLeaflet();

  clearMarkers();

  lista.forEach(m => {
    const clasificacion = m.comercial?.clasificacion || m.estado;
    const iconColor = clasificacion === "Cliente" ? "green" : "blue";
    const marker = L.marker([m.lat, m.long], { icon: crearIcono(iconColor) }).addTo(map);
    marker.on("click", () => onSelectMunicipio(m));
    markers.push({ marker, data: m });
  });
}

export function flyToMunicipio(municipio) {
  map.flyTo([municipio.lat, municipio.long], 11, { duration: 1 });
}
