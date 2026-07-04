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
