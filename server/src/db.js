const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, "..", "data", "database.sqlite");

const COMMERCIAL_SCHEMA = `
CREATE TABLE IF NOT EXISTS municipio_comercial (
  municipio_id TEXT PRIMARY KEY,
  estado_comercial TEXT,
  proxima_accion TEXT,
  fecha_proxima_accion TEXT,
  notas TEXT,
  prioridad TEXT,
  sistema_actual TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (municipio_id) REFERENCES municipios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_municipio_comercial_estado ON municipio_comercial(estado_comercial);
CREATE INDEX IF NOT EXISTS idx_municipio_comercial_prioridad ON municipio_comercial(prioridad);
CREATE INDEX IF NOT EXISTS idx_municipio_comercial_fecha_proxima_accion ON municipio_comercial(fecha_proxima_accion);
`;

const DAILY_WORK_SCHEMA = `
CREATE TABLE IF NOT EXISTS ritual_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ritual_items_activo_orden ON ritual_items(activo, orden);

CREATE TABLE IF NOT EXISTS ritual_checks (
  item_id INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  completado INTEGER NOT NULL DEFAULT 0 CHECK (completado IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id, fecha),
  FOREIGN KEY (item_id) REFERENCES ritual_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ritual_checks_fecha ON ritual_checks(fecha);

CREATE TABLE IF NOT EXISTS trabajo_tareas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada')),
  prioridad TEXT NOT NULL DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta')),
  completada_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trabajo_tareas_fecha_estado ON trabajo_tareas(fecha, estado);
CREATE INDEX IF NOT EXISTS idx_trabajo_tareas_prioridad ON trabajo_tareas(prioridad);
`;

function openDb() {
  const db = new DatabaseSync(DB_PATH, {
    open: true,
    readOnly: false
  });
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(COMMERCIAL_SCHEMA);
  db.exec(DAILY_WORK_SCHEMA);
  return db;
}

module.exports = {
  DB_PATH,
  openDb
};
