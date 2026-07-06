import * as cards from "./cards.js";
import { getMunicipioId, loadMunicipioDetalle, loadMunicipios, updateMunicipioComercial } from "./data.js";
import { setupFilters } from "./filters.js";
import { flyToMunicipio, initMap, mostrarMarkers } from "./map.js";

const elements = {
  infoContent: document.getElementById("info-content"),
  estadoFilter: document.getElementById("estado-filter"),
  nombreFilter: document.getElementById("nombre-filter"),
  pobMinInput: document.getElementById("pob-min"),
  pobMaxInput: document.getElementById("pob-max"),
  advancedFilters: document.getElementById("advanced-filters"),
  advancedFiltersToggle: document.getElementById("advanced-filters-toggle"),
  applyFiltersBtn: document.getElementById("apply-filters"),
  politicoFilter: document.getElementById("politico-filter"),
  seccionelectoralFilter: document.getElementById("seccionelectoral-filter"),
  listaResultados: document.getElementById("lista-resultados")
};

async function renderMunicipioFicha(municipio) {
  const id = getMunicipioId(municipio);

  if (!id) {
    cards.renderFichaError(elements.infoContent, new Error("El municipio no tiene id para consultar el backend"));
    return;
  }

  cards.renderFichaLoading(elements.infoContent, municipio);

  try {
    const detalle = await loadMunicipioDetalle(id);
    renderFichaView(detalle);
  } catch (error) {
    cards.renderFichaError(elements.infoContent, error);
    console.error(error);
  }
}

function renderFichaView(municipio) {
  cards.renderInfoPanel(elements.infoContent, municipio, {
    onEdit: () => renderFichaEdit(municipio)
  });
}

function renderFichaEdit(municipio, error = null, isSaving = false) {
  cards.renderInfoPanel(elements.infoContent, municipio, {
    mode: "edit",
    error,
    isSaving,
    onCancel: () => renderFichaView(municipio),
    onSave: async (payload) => {
      renderFichaEdit(municipio, null, true);

      try {
        const id = getMunicipioId(municipio);
        await updateMunicipioComercial(id, payload);
        const detalle = await loadMunicipioDetalle(id);
        renderFichaView(detalle);
      } catch (saveError) {
        renderFichaEdit(municipio, saveError, false);
        console.error(saveError);
      }
    }
  });
}

function renderMarkerSelection(municipio) {
  renderMunicipioFicha(municipio);
}

function renderListSelection(municipio) {
  renderMunicipioFicha(municipio);

  try {
    flyToMunicipio(municipio);
  } catch (error) {
    console.error(error);
  }
}

function renderFilteredMunicipios(municipios) {
  mostrarMarkers(municipios, renderMarkerSelection);
  cards.renderListaResultados(elements.listaResultados, municipios, renderListSelection);
}

async function main() {
  cards.renderInitialState(elements.infoContent, elements.listaResultados);

  try {
    initMap();

    const municipiosData = await loadMunicipios();
    mostrarMarkers(municipiosData, renderMarkerSelection);
    setupFilters(elements, municipiosData, renderFilteredMunicipios);
  } catch (error) {
    cards.renderLoadError(elements.infoContent, elements.listaResultados, error);
    console.error(error);
  }
}

main();
