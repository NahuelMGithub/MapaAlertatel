const appShell = document.querySelector(".app-shell");

const collapseTargets = {
  left: {
    className: "is-left-collapsed",
    expandTitle: "Expandir filtros y lista",
    collapseTitle: "Compactar filtros y lista",
  },
  right: {
    className: "is-right-collapsed",
    expandTitle: "Expandir ficha del municipio",
    collapseTitle: "Compactar ficha del municipio",
  },
  bottom: {
    className: "is-bottom-collapsed",
    expandTitle: "Expandir trabajo diario",
    collapseTitle: "Compactar trabajo diario",
  },
};

function refreshMapSize() {
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });

  window.setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 220);
}

function updateButton(button, config, isCollapsed) {
  button.textContent = isCollapsed ? "Expandir" : "Compactar";
  button.title = isCollapsed ? config.expandTitle : config.collapseTitle;
  button.setAttribute("aria-expanded", String(!isCollapsed));
}

function setupCollapseControls() {
  if (!appShell) return;

  document.querySelectorAll("[data-collapse-target]").forEach((button) => {
    const target = button.dataset.collapseTarget;
    const config = collapseTargets[target];

    if (!config) return;

    updateButton(button, config, appShell.classList.contains(config.className));

    button.addEventListener("click", () => {
      const isCollapsed = appShell.classList.toggle(config.className);
      updateButton(button, config, isCollapsed);
      refreshMapSize();
    });
  });
}

setupCollapseControls();
