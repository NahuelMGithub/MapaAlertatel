const MUNICIPIOS_URL = "../data/municipios.json";

export async function loadMunicipios() {
  const response = await fetch(MUNICIPIOS_URL);

  if (!response.ok) {
    throw new Error(`No se pudo cargar ${MUNICIPIOS_URL}`);
  }

  return response.json();
}
