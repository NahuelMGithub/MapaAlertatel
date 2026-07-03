PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS municipios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  departamento TEXT,
  provincia TEXT,
  estado TEXT,
  politico TEXT,
  intendente TEXT,
  poblacion TEXT,
  lat REAL,
  long REAL,
  raw_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_municipios_nombre ON municipios(nombre);
CREATE INDEX IF NOT EXISTS idx_municipios_estado ON municipios(estado);
CREATE INDEX IF NOT EXISTS idx_municipios_provincia ON municipios(provincia);
