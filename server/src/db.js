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

function openDb() {
  const db = new DatabaseSync(DB_PATH, {
    open: true,
    readOnly: false
  });
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(COMMERCIAL_SCHEMA);
  return db;
}

module.exports = {
  DB_PATH,
  openDb
};
