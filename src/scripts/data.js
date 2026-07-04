const MUNICIPIOS_URL = "../data/municipios.json";
const API_BASE_URL = globalThis.ALERTATEL_API_BASE_URL || "http://localhost:3001/api";

const EMPTY_COMERCIAL = {
  estado_comercial: null,
  proxima_accion: null,
  fecha_proxima_accion: null,
  prioridad: null,
  sistema_actual: null,
  notas: null
};

export async function loadMunicipios() {
  const response = await fetch(MUNICIPIOS_URL);

  if (!response.ok) {
    throw new Error(`No se pudo cargar ${MUNICIPIOS_URL}`);
  }

  return response.json();
}

export function getMunicipioId(municipio) {
  return municipio?.id || municipio?.Cod_Gl_Res144_Indec;
}

function normalizeMunicipioDetalle(municipio) {
  const raw = municipio.raw || {};

  return {
    ...raw,
    ...municipio,
    Provincia: raw.Provincia || municipio.provincia,
    Departamento: raw.Departamento || municipio.departamento,
    comercial: {
      ...EMPTY_COMERCIAL,
      ...(municipio.comercial || {})
    }
  };
}

async function parseApiResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "No se pudo completar la operacion");
  }

  return data;
}

export async function loadMunicipioDetalle(id) {
  const response = await fetch(`${API_BASE_URL}/municipios/${encodeURIComponent(id)}`);
  const data = await parseApiResponse(response);

  return normalizeMunicipioDetalle(data);
}

export async function updateMunicipioComercial(id, payload) {
  const response = await fetch(`${API_BASE_URL}/municipios/${encodeURIComponent(id)}/comercial`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseApiResponse(response);
}
