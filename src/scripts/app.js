import * as cards from "./cards.js";
import {
  createTarea,
  getMunicipioId,
  loadMunicipioDetalle,
  loadMunicipios,
  loadTareas,
  setTareaCompletada,
  updateMunicipioComercial
} from "./data.js";
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

function getTodayDate() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

async function loadMunicipioTasks(id) {
  if (!id) return [];

  const data = await loadTareas({ municipio_id: id });
  return (data.tareas || []).filter((task) => task.municipio_id === id);
}

async function renderMunicipioFicha(municipio) {
  const id = getMunicipioId(municipio);

  if (!id) {
    cards.renderFichaError(elements.infoContent, new Error("El municipio no tiene id para consultar el backend"));
    return;
  }

  cards.renderFichaLoading(elements.infoContent, municipio);

  try {
    const [detalle, tareas] = await Promise.all([
      loadMunicipioDetalle(id),
      loadMunicipioTasks(id)
    ]);
    renderFichaView(detalle, tareas);
  } catch (error) {
    cards.renderFichaError(elements.infoContent, error);
    console.error(error);
  }
}

function renderFichaView(municipio, tareas = [], taskError = null) {
  cards.renderInfoPanel(elements.infoContent, municipio, {
    tasks: tareas,
    taskError,
    onEdit: () => renderFichaEdit(municipio, tareas),
    onTaskCreate: async (payload) => {
      try {
        const id = getMunicipioId(municipio);
        await createTarea({ ...payload, municipio_id: id });
        renderMunicipioFicha(municipio);
      } catch (error) {
        renderFichaView(municipio, tareas, error);
        console.error(error);
      }
    },
    onTaskToggle: async (taskId, completado) => {
      try {
        await setTareaCompletada(taskId, completado, getTodayDate());
        renderMunicipioFicha(municipio);
      } catch (error) {
        renderFichaView(municipio, tareas, error);
        console.error(error);
      }
    }
  });
}

function renderFichaEdit(municipio, tareas = [], error = null, isSaving = false) {
  cards.renderInfoPanel(elements.infoContent, municipio, {
    mode: "edit",
    tasks: tareas,
    error,
    isSaving,
    onCancel: () => renderFichaView(municipio, tareas),
    onTaskCreate: async (payload) => {
      try {
        const id = getMunicipioId(municipio);
        await createTarea({ ...payload, municipio_id: id });
        renderMunicipioFicha(municipio);
      } catch (taskError) {
        renderFichaView(municipio, tareas, taskError);
        console.error(taskError);
      }
    },
    onTaskToggle: async (taskId, completado) => {
      try {
        await setTareaCompletada(taskId, completado, getTodayDate());
        renderMunicipioFicha(municipio);
      } catch (taskError) {
        renderFichaView(municipio, tareas, taskError);
        console.error(taskError);
      }
    },
    onSave: async (payload) => {
      renderFichaEdit(municipio, tareas, null, true);

      try {
        const id = getMunicipioId(municipio);
        await updateMunicipioComercial(id, payload);
        const [detalle, nextTasks] = await Promise.all([
          loadMunicipioDetalle(id),
          loadMunicipioTasks(id)
        ]);
        renderFichaView(detalle, nextTasks);
      } catch (saveError) {
        renderFichaEdit(municipio, tareas, saveError, false);
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
