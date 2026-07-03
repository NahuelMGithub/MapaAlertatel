function getFilterValues(elements) {
  return {
    estado: elements.estadoFilter.value,
    nombre: elements.nombreFilter.value.toLowerCase(),
    pobMin: parseInt(elements.pobMinInput.value) || 0,
    pobMax: parseInt(elements.pobMaxInput.value) || Infinity,
    politico: elements.politicoFilter.value.toLowerCase(),
    seccion: elements.seccionelectoralFilter.value.toLowerCase()
  };
}

export function aplicarFiltros(municipiosData, filters) {
  return municipiosData.filter(m => {
    const poblacion = parseInt(String(m.poblacion).replace(/\./g, "")) || 0;
    const nombre = m.nombre ? m.nombre.toLowerCase() : "";
    const politico = m.politico ? m.politico.toLowerCase() : "";
    const seccion = m.seccionelectoral ? m.seccionelectoral.toLowerCase() : "";

    const matchEstado = filters.estado === "todos" || m.estado === filters.estado;
    const matchNombre = nombre.includes(filters.nombre);
    const matchPoblacion = poblacion >= filters.pobMin && poblacion <= filters.pobMax;
    const matchPolitico = politico.includes(filters.politico);
    const matchSeccion = seccion.includes(filters.seccion);

    return matchEstado && matchNombre && matchPoblacion && matchPolitico && matchSeccion;
  });
}

export function setupFilters(elements, municipiosData, onFiltered) {
  elements.applyFiltersBtn.addEventListener("click", () => {
    const filters = getFilterValues(elements);
    const filtrados = aplicarFiltros(municipiosData, filters);

    onFiltered(filtrados);
  });
}
