const API_BASE_URL = globalThis.ALERTATEL_API_BASE_URL || "http://localhost:3001/api";

const elements = {
  routineCard: document.querySelector(".workday-card--routine"),
  todayCard: document.querySelector(".workday-card--today"),
  currentDate: document.getElementById("workday-current-date"),
  ritualCount: document.getElementById("ritual-count"),
  ritualList: document.getElementById("ritual-list"),
  ritualError: document.getElementById("ritual-error"),
  tasksCount: document.getElementById("tasks-count"),
  tasksList: document.getElementById("tasks-list"),
  tasksError: document.getElementById("tasks-error"),
  tasksEmpty: document.getElementById("tasks-empty"),
  taskForm: document.getElementById("task-create-form"),
  taskMunicipioSelect: document.getElementById("task-municipio-select"),
  okrStatus: document.getElementById("okr-status"),
  okrBlock: document.getElementById("okr-block"),
  okrError: document.getElementById("okr-error"),
  helpButton: document.getElementById("workday-help-button"),
  helpModal: document.getElementById("workday-help-modal"),
  helpClose: document.getElementById("workday-help-close")
};

const state = {
  fecha: getTodayDate(),
  mes: getCurrentMonth(),
  ritual: [],
  tareas: [],
  municipios: [],
  okr: null
};

function getTodayDate() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function getCurrentMonth() {
  return getTodayDate().slice(0, 7);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function parseApiResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "No se pudo completar la operacion");
  }

  return data;
}

async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  return parseApiResponse(response);
}

async function apiSend(path, method, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseApiResponse(response);
}

function setError(element, error) {
  element.textContent = error ? error.message : "";
  element.classList.toggle("is-hidden", !error);
}

function setLoading() {
  elements.ritualCount.textContent = "Cargando";
  elements.tasksCount.textContent = "Cargando";
  elements.okrStatus.textContent = "Cargando";
  elements.ritualList.innerHTML = `<div class="workday-loading">Cargando ritual diario...</div>`;
  elements.tasksList.innerHTML = `<div class="workday-loading">Cargando tareas...</div>`;
  elements.okrBlock.innerHTML = `<div class="workday-loading">Cargando OKR del mes...</div>`;
  elements.tasksEmpty.classList.add("is-hidden");
}

function priorityLabel(prioridad) {
  const labels = {
    alta: "Alta",
    media: "Media",
    baja: "Baja"
  };

  return labels[prioridad] || "Media";
}

function priorityClass(prioridad) {
  if (prioridad === "alta") {
    return "daily-status--urgent";
  }

  if (prioridad === "baja") {
    return "daily-status--signal";
  }

  return "daily-status--today";
}

function taskDateBadge(task) {
  if (task.estado === "completada") {
    return `<span class="daily-status daily-status--done">Completada</span>`;
  }

  if (task.fecha < state.fecha) {
    return `<span class="daily-status daily-status--late">Vencida ${escapeHtml(task.fecha)}</span>`;
  }

  return "";
}

function renderRitual() {
  const completed = state.ritual.filter((item) => item.completado).length;
  elements.ritualCount.textContent = `${completed}/${state.ritual.length}`;

  if (state.ritual.length === 0) {
    elements.ritualList.innerHTML = `<div class="workday-loading">No hay items de ritual cargados.</div>`;
    return;
  }

  elements.ritualList.innerHTML = state.ritual
    .map(
      (item) => `
        <label class="routine-item routine-item--check">
          <input type="checkbox" data-ritual-id="${item.id}" ${item.completado ? "checked" : ""}>
          <span>${escapeHtml(String(item.orden).padStart(2, "0"))}</span>
          <strong>${escapeHtml(item.titulo)}</strong>
          <p>${escapeHtml(item.descripcion || "Pendiente para hoy")}</p>
        </label>
      `
    )
    .join("");

  elements.ritualList.querySelectorAll("[data-ritual-id]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => handleRitualCheck(checkbox));
  });
}

function renderTasks() {
  elements.tasksCount.textContent = `${state.tareas.length} tareas`;
  elements.tasksEmpty.classList.toggle("is-hidden", state.tareas.length > 0);

  if (state.tareas.length === 0) {
    elements.tasksList.innerHTML = "";
    return;
  }

  const sortedTasks = [...state.tareas].sort((a, b) => {
    if (a.estado === b.estado) return 0;
    return a.estado === "completada" ? 1 : -1;
  });

  elements.tasksList.innerHTML = sortedTasks
    .map(
      (task) => `
        <div class="work-list-item task-list-item ${task.estado === "completada" ? "task-list-item--done" : ""}">
          <div class="task-list-item__main">
            <div class="task-list-item__badges">
              ${taskDateBadge(task)}
              ${task.municipio_nombre ? `<span class="daily-status daily-status--account">${escapeHtml(task.municipio_nombre)}</span>` : ""}
              <span class="daily-status ${priorityClass(task.prioridad)}">${priorityLabel(task.prioridad)}</span>
            </div>
            <strong>${escapeHtml(task.titulo)}</strong>
            ${task.descripcion ? `<p>${escapeHtml(task.descripcion)}</p>` : ""}
          </div>
          <button class="secondary-action task-list-item__action" type="button" data-task-id="${task.id}" data-task-completed="${task.estado === "completada"}">
            ${task.estado === "completada" ? "Reactivar" : "Completar"}
          </button>
        </div>
      `
    )
    .join("");

  elements.tasksList.querySelectorAll("[data-task-id]").forEach((button) => {
    button.addEventListener("click", () => handleTaskCheck(button));
  });
}

function defaultOkr() {
  return {
    mes: state.mes,
    objetivo: "Convertir el mapa en una agenda comercial accionable",
    descripcion: "Que cada municipio importante tenga estado, prioridad y proxima accion clara.",
    estado: "borrador",
    resultados: [
      {
        titulo: "40 fichas revisadas",
        descripcion: "Estado comercial actualizado",
        avance: 0,
        meta: 40,
        unidad: "fichas"
      },
      {
        titulo: "25 proximas acciones",
        descripcion: "Con fecha definida",
        avance: 0,
        meta: 25,
        unidad: "acciones"
      },
      {
        titulo: "15 conversaciones nuevas",
        descripcion: "Prospectos o clientes activos",
        avance: 0,
        meta: 15,
        unidad: "conversaciones"
      }
    ]
  };
}

function renderOkr() {
  const okr = state.okr || defaultOkr();
  const resultados = [...okr.resultados];

  while (resultados.length < 3) {
    resultados.push({ titulo: "", descripcion: "", avance: 0, meta: 1, unidad: "" });
  }

  elements.okrStatus.textContent = okr.estado === "activo" ? "Activo" : okr.estado === "cerrado" ? "Cerrado" : "Borrador";
  elements.okrBlock.innerHTML = `
    <form class="okr-form" id="okr-form">
      <div class="okr-form__top">
        <label>
          <span>Mes</span>
          <input name="mes" type="month" value="${escapeHtml(okr.mes || state.mes)}" required>
        </label>
        <label>
          <span>Estado</span>
          <select name="estado">
            <option value="borrador" ${okr.estado === "borrador" ? "selected" : ""}>Borrador</option>
            <option value="activo" ${okr.estado === "activo" ? "selected" : ""}>Activo</option>
            <option value="cerrado" ${okr.estado === "cerrado" ? "selected" : ""}>Cerrado</option>
          </select>
        </label>
      </div>
      <label class="okr-form__objective">
        <span>Objetivo</span>
        <input name="objetivo" type="text" value="${escapeHtml(okr.objetivo)}" required>
      </label>
      <label class="okr-form__objective">
        <span>Descripcion</span>
        <input name="descripcion" type="text" value="${escapeHtml(okr.descripcion || "")}">
      </label>
      <div class="okr-results">
        ${resultados
          .slice(0, 3)
          .map(
            (resultado, index) => `
              <div class="okr-result-field">
                <span>KR${index + 1}</span>
                <input name="resultado_titulo_${index}" type="text" value="${escapeHtml(resultado.titulo || "")}" placeholder="Resultado clave">
                <input name="resultado_descripcion_${index}" type="text" value="${escapeHtml(resultado.descripcion || "")}" placeholder="Detalle">
                <div class="okr-progress-row">
                  <label>
                    <span>Avance</span>
                    <input name="resultado_avance_${index}" type="number" min="0" step="1" value="${escapeHtml(resultado.avance ?? 0)}" data-okr-progress="${index}">
                  </label>
                  <label>
                    <span>Meta</span>
                    <input name="resultado_meta_${index}" type="number" min="1" step="1" value="${escapeHtml(resultado.meta ?? 1)}">
                  </label>
                  <label>
                    <span>Unidad</span>
                    <input name="resultado_unidad_${index}" type="text" value="${escapeHtml(resultado.unidad || "")}" placeholder="fichas">
                  </label>
                </div>
                <div class="okr-progress-actions">
                  <button class="secondary-action" type="button" data-okr-step="${index}" data-step-delta="-1">-</button>
                  <strong>${escapeHtml(resultado.avance ?? 0)} / ${escapeHtml(resultado.meta ?? 1)} ${escapeHtml(resultado.unidad || "")}</strong>
                  <button class="secondary-action" type="button" data-okr-step="${index}" data-step-delta="1">+</button>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
      <div class="okr-form__actions">
        <button class="secondary-action" type="button" id="okr-close-month" ${okr.estado === "cerrado" ? "disabled" : ""}>Cerrar mes</button>
        <button class="primary-action" type="submit">Guardar OKR</button>
      </div>
    </form>
  `;

  elements.okrBlock.querySelector("#okr-form").addEventListener("submit", handleOkrSave);
  elements.okrBlock.querySelector("#okr-close-month").addEventListener("click", handleOkrCloseMonth);
  elements.okrBlock.querySelectorAll("[data-okr-step]").forEach((button) => {
    button.addEventListener("click", () => handleOkrStep(button));
  });
}

async function loadRitual() {
  const data = await apiGet(`/trabajo/ritual?fecha=${encodeURIComponent(state.fecha)}`);
  state.ritual = data.items || [];
  renderRitual();
}

async function loadTasks() {
  const data = await apiGet(`/trabajo/tareas?fecha=${encodeURIComponent(state.fecha)}`);
  state.tareas = data.tareas || [];
  renderTasks();
}

async function loadOkr() {
  const data = await apiGet(`/trabajo/okr?mes=${encodeURIComponent(state.mes)}`);
  state.okr = data.okr || defaultOkr();
  renderOkr();
}

function renderMunicipioOptions() {
  if (!elements.taskMunicipioSelect) return;

  elements.taskMunicipioSelect.innerHTML = `
    <option value="">Sin municipio</option>
    ${state.municipios
      .map((municipio) => `<option value="${escapeHtml(municipio.id)}">${escapeHtml(municipio.nombre)}</option>`)
      .join("")}
  `;
}

async function loadMunicipios() {
  const municipios = await apiGet("/municipios");
  state.municipios = municipios || [];
  renderMunicipioOptions();
}

async function handleRitualCheck(checkbox) {
  const itemId = checkbox.dataset.ritualId;
  const completado = checkbox.checked;

  checkbox.disabled = true;
  setError(elements.ritualError, null);

  try {
    await apiSend(`/trabajo/ritual/${encodeURIComponent(itemId)}/check`, "PATCH", {
      fecha: state.fecha,
      completado
    });
    await loadRitual();
  } catch (error) {
    checkbox.checked = !completado;
    setError(elements.ritualError, error);
  } finally {
    checkbox.disabled = false;
  }
}

async function handleTaskCheck(button) {
  const taskId = button.dataset.taskId;
  const completado = button.dataset.taskCompleted !== "true";
  button.disabled = true;
  setError(elements.tasksError, null);

  try {
    await apiSend(`/trabajo/tareas/${encodeURIComponent(taskId)}/check`, "PATCH", {
      fecha: state.fecha,
      completado
    });
    await loadTasks();
  } catch (error) {
    setError(elements.tasksError, error);
    button.disabled = false;
  }
}

function setupTodayHeightSync() {
  if (!elements.routineCard || !elements.todayCard || !("ResizeObserver" in window)) return;

  const syncHeight = () => {
    elements.todayCard.style.setProperty("--today-card-height", `${elements.routineCard.offsetHeight}px`);
  };

  const observer = new ResizeObserver(syncHeight);
  observer.observe(elements.routineCard);
  window.addEventListener("resize", syncHeight);
  syncHeight();
}

async function handleTaskCreate(event) {
  event.preventDefault();

  const formData = new FormData(elements.taskForm);
  const titulo = String(formData.get("titulo") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const prioridad = String(formData.get("prioridad") || "media");
  const municipioId = String(formData.get("municipio_id") || "").trim();
  const submitButton = elements.taskForm.querySelector("button[type='submit']");

  if (!titulo) {
    setError(elements.tasksError, new Error("El titulo de la tarea es obligatorio"));
    return;
  }

  submitButton.disabled = true;
  setError(elements.tasksError, null);

  try {
    await apiSend("/trabajo/tareas", "POST", {
      titulo,
      descripcion: descripcion || null,
      prioridad,
      municipio_id: municipioId || null,
      fecha: state.fecha
    });
    elements.taskForm.reset();
    await loadTasks();
  } catch (error) {
    setError(elements.tasksError, error);
  } finally {
    submitButton.disabled = false;
  }
}

async function handleOkrSave(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const submitButton = form.querySelector("button[type='submit']");
  const resultados = [0, 1, 2].map((index) => ({
    titulo: String(formData.get(`resultado_titulo_${index}`) || "").trim(),
    descripcion: String(formData.get(`resultado_descripcion_${index}`) || "").trim(),
    avance: Number(formData.get(`resultado_avance_${index}`) || 0),
    meta: Number(formData.get(`resultado_meta_${index}`) || 1),
    unidad: String(formData.get(`resultado_unidad_${index}`) || "").trim()
  }));

  submitButton.disabled = true;
  setError(elements.okrError, null);

  try {
    const okr = await apiSend("/trabajo/okr", "PUT", {
      mes: String(formData.get("mes") || state.mes),
      estado: String(formData.get("estado") || "borrador"),
      objetivo: String(formData.get("objetivo") || "").trim(),
      descripcion: String(formData.get("descripcion") || "").trim() || null,
      resultados
    });

    state.mes = okr.mes;
    state.okr = okr;
    renderOkr();
  } catch (error) {
    setError(elements.okrError, error);
  } finally {
    submitButton.disabled = false;
  }
}

async function handleOkrStep(button) {
  const form = button.closest("form");
  const index = Number(button.dataset.okrStep);
  const delta = Number(button.dataset.stepDelta);
  const input = form.querySelector(`[name="resultado_avance_${index}"]`);
  const current = Number(input.value || 0);

  input.value = String(Math.max(0, current + delta));
  await handleOkrSave({ preventDefault() {}, currentTarget: form });
}

async function handleOkrCloseMonth(event) {
  const button = event.currentTarget;

  button.disabled = true;
  setError(elements.okrError, null);

  try {
    const data = await apiSend("/trabajo/okr/cerrar", "POST", {
      mes: state.mes
    });

    state.mes = data.siguiente.mes;
    state.okr = data.siguiente;
    renderOkr();
  } catch (error) {
    setError(elements.okrError, error);
    button.disabled = false;
  }
}

function openHelpModal() {
  elements.helpModal.classList.remove("is-hidden");
}

function closeHelpModal() {
  elements.helpModal.classList.add("is-hidden");
}

function setupHelpModal() {
  elements.helpButton.addEventListener("click", openHelpModal);
  elements.helpClose.addEventListener("click", closeHelpModal);

  elements.helpModal.addEventListener("click", (event) => {
    if (event.target === elements.helpModal) {
      closeHelpModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.helpModal.classList.contains("is-hidden")) {
      closeHelpModal();
    }
  });
}

async function init() {
  elements.currentDate.textContent = state.fecha;
  elements.taskForm.addEventListener("submit", handleTaskCreate);
  setupHelpModal();
  setupTodayHeightSync();
  setLoading();

  const results = await Promise.allSettled([loadRitual(), loadTasks(), loadMunicipios(), loadOkr()]);
  const ritualResult = results[0];
  const tasksResult = results[1];
  const municipiosResult = results[2];
  const okrResult = results[3];

  if (ritualResult.status === "rejected") {
    elements.ritualList.innerHTML = "";
    elements.ritualCount.textContent = "Error";
    setError(elements.ritualError, ritualResult.reason);
  }

  if (tasksResult.status === "rejected") {
    elements.tasksList.innerHTML = "";
    elements.tasksCount.textContent = "Error";
    elements.tasksEmpty.classList.add("is-hidden");
    setError(elements.tasksError, tasksResult.reason);
  }

  if (municipiosResult.status === "rejected") {
    setError(elements.tasksError, municipiosResult.reason);
  }

  if (okrResult.status === "rejected") {
    elements.okrBlock.innerHTML = "";
    elements.okrStatus.textContent = "Error";
    setError(elements.okrError, okrResult.reason);
  }
}

init();
