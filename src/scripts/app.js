import { renderInitialState, renderInfoPanel, renderListaResultados, renderFilterCount, renderLoadError } from "./cards.js";
import { loadMunicipios } from "./data.js";
import { setupFilters } from "./filters.js";
import { flyToMunicipio, initMap, mostrarMarkers } from "./map.js";

const elements = {
  infoContent: document.getElementById("info-content"),
  estadoFilter: document.getElementById("estado-filter"),
  nombreFilter: document.getElementById("nombre-filter"),
  pobMinInput: document.getElementById("pob-min"),
  pobMaxInput: document.getElementById("pob-max"),
  applyFiltersBtn: document.getElementById("apply-filters"),
  politicoFilter: document.getElementById("politico-filter"),
  seccionelectoralFilter: document.getElementById("seccionelectoral-filter"),
  listaResultados: document.getElementById("lista-resultados")
};

function renderMarkerSelection(municipio) {
  renderInfoPanel(elements.infoContent, municipio);
}

function renderListSelection(municipio) {
  flyToMunicipio(municipio);
  renderInfoPanel(elements.infoContent, municipio);
}

function renderFilteredMunicipios(municipios) {
  mostrarMarkers(municipios, renderMarkerSelection);
  renderListaResultados(elements.listaResultados, municipios, renderListSelection);
  renderFilterCount(elements.infoContent, municipios.length);
}

async function main() {
  renderInitialState(elements.infoContent, elements.listaResultados);

  try {
    initMap();

    const municipiosData = await loadMunicipios();
    mostrarMarkers(municipiosData, renderMarkerSelection);
    setupFilters(elements, municipiosData, renderFilteredMunicipios);
  } catch (error) {
    renderLoadError(elements.infoContent, elements.listaResultados, error);
    console.error(error);
  }
}

main();
