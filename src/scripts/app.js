import * as cards from "./cards.js";
import {
  eliminarProximaAccion,
  finalizarProximaAccion,
  getMunicipioId,
  loadMunicipioDetalle,
  loadMunicipios,
  loadProximasAcciones,
  updateMunicipioComercial
} from "./data.js";
import { setupFilters } from "./filters.js";
import { flyToMunicipio, initMap, mostrarMarkers } from "./map.js";

const elements = {
  infoContent: document.getElementById("info-content"),
  estadoFilter: document.getElementById("estado-filter"),
  ojosEnAlertaFilter: document.getElementById("ojos-en-alerta-filter"),
  nombreFilter: document.getElementById("nombre-filter"),
  pobMinInput: document.getElementById("pob-min"),
  pobMaxInput: document.getElementById("pob-max"),
  advancedFilters: document.getElementById("advanced-filters"),
  advancedFiltersToggle: document.getElementById("advanced-filters-toggle"),
  applyFiltersBtn: document.getElementById("apply-filters"),
  politicoFilter: document.getElementById("politico-filter"),
  seccionelectoralFilter: document.getElementById("seccionelectoral-filter"),
  listaResultados: document.getElementById("lista-resultados"),
  nextActionsCount: document.getElementById("next-actions-count"),
  nextActionsList: document.getElementById("next-actions-list")
};

let municipiosData = [];

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
    onEdit: () => renderFichaEdit(municipio),
    onActionDelete: async () => {
      await eliminarProximaAccion(getMunicipioId(municipio));
      await Promise.all([renderMunicipioFicha(municipio), renderGlobalActions()]);
    },
    onActionFinish: async () => {
      await finalizarProximaAccion(getMunicipioId(municipio));
      await Promise.all([renderMunicipioFicha(municipio), renderGlobalActions()]);
    },
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
        renderGlobalActions();
      } catch (saveError) {
        renderFichaEdit(municipio, saveError, false);
        console.error(saveError);
      }
    }
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function openActionMunicipality(id, edit = false) {
  const municipio = municipiosData.find((item) => getMunicipioId(item) === id);
  const detalle = await loadMunicipioDetalle(id);
  if (edit) {
    renderFichaEdit(detalle);
  } else {
    renderFichaView(detalle);
  }
  if (municipio) flyToMunicipio(municipio);
}

async function renderGlobalActions() {
  const acciones = await loadProximasAcciones();
  elements.nextActionsCount.textContent = String(acciones.length);
  elements.nextActionsList.innerHTML = acciones.length
    ? acciones.map((accion) => `
        <div class="daily-item" data-action-municipality="${escapeHtml(accion.municipio_id)}">
          <span class="daily-status daily-status--account">${escapeHtml(accion.municipio_nombre)}</span>
          <strong>${escapeHtml(accion.titulo)}</strong>
          ${accion.descripcion ? `<p>${escapeHtml(accion.descripcion)}</p>` : ""}
          <small>${escapeHtml(accion.fecha || "Sin fecha")}</small>
          <div class="form-actions">
            <button class="secondary-action" type="button" data-action="view">Ver municipio</button>
            <button class="secondary-action" type="button" data-action="edit">Editar</button>
            <button class="secondary-action" type="button" data-action="delete">Eliminar</button>
            <button class="primary-action" type="button" data-action="finish">Finalizar</button>
          </div>
        </div>
      `).join("")
    : `<div class="daily-empty"><strong>No hay próximas acciones pendientes</strong></div>`;

  elements.nextActionsList.querySelectorAll("[data-action-municipality]").forEach((item) => {
    item.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = item.dataset.actionMunicipality;
        if (button.dataset.action === "view") await openActionMunicipality(id);
        if (button.dataset.action === "edit") await openActionMunicipality(id, true);
        if (button.dataset.action === "delete") {
          await eliminarProximaAccion(id);
          await renderGlobalActions();
        }
        if (button.dataset.action === "finish") {
          await finalizarProximaAccion(id);
          await renderGlobalActions();
        }
      });
    });
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

    municipiosData = await loadMunicipios();
    mostrarMarkers(municipiosData, renderMarkerSelection);
    setupFilters(elements, municipiosData, renderFilteredMunicipios);
    await renderGlobalActions();
  } catch (error) {
    cards.renderLoadError(elements.infoContent, elements.listaResultados, error);
    console.error(error);
  }
}

main();
