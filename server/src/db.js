const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, "..", "data", "database.sqlite");

const COMMERCIAL_SCHEMA = `
CREATE TABLE IF NOT EXISTS municipio_comercial (
  municipio_id TEXT PRIMARY KEY,
  estado_comercial TEXT,
  proxima_accion TEXT,
  proxima_accion_descripcion TEXT,
  fecha_proxima_accion TEXT,
  proxima_accion_estado TEXT DEFAULT 'pendiente',
  proxima_accion_completada_at TEXT,
  notas TEXT,
  prioridad TEXT,
  sistema_actual TEXT,
  clasificacion TEXT CHECK (clasificacion IN ('Cliente', 'No cliente') OR clasificacion IS NULL),
  subclasificacion TEXT CHECK (subclasificacion IN ('Prospecto') OR subclasificacion IS NULL),
  servicio TEXT,
  ojos_en_alerta INTEGER CHECK (ojos_en_alerta IN (0, 1) OR ojos_en_alerta IS NULL),
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
  municipio_id TEXT,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada')),
  prioridad TEXT NOT NULL DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta')),
  completada_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (municipio_id) REFERENCES municipios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_trabajo_tareas_fecha_estado ON trabajo_tareas(fecha, estado);
CREATE INDEX IF NOT EXISTS idx_trabajo_tareas_prioridad ON trabajo_tareas(prioridad);

CREATE TABLE IF NOT EXISTS trabajo_okr_mensual (
  mes TEXT PRIMARY KEY,
  objetivo TEXT NOT NULL,
  descripcion TEXT,
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'activo', 'cerrado')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trabajo_okr_resultados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mes TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  avance INTEGER NOT NULL DEFAULT 0,
  meta INTEGER NOT NULL DEFAULT 1,
  unidad TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mes) REFERENCES trabajo_okr_mensual(mes) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trabajo_okr_resultados_mes_orden ON trabajo_okr_resultados(mes, orden);
`;

function ensureColumn(db, tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  const exists = columns.some((column) => column.name === columnName);

  if (!exists) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

function openDb() {
  const db = new DatabaseSync(DB_PATH, {
    open: true,
    readOnly: false
  });
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(COMMERCIAL_SCHEMA);
  db.exec(DAILY_WORK_SCHEMA);
  ensureColumn(db, "municipio_comercial", "clasificacion", "TEXT");
  ensureColumn(db, "municipio_comercial", "subclasificacion", "TEXT");
  ensureColumn(db, "municipio_comercial", "servicio", "TEXT");
  ensureColumn(db, "municipio_comercial", "ojos_en_alerta", "INTEGER");
  ensureColumn(db, "municipio_comercial", "proxima_accion_descripcion", "TEXT");
  ensureColumn(db, "municipio_comercial", "proxima_accion_estado", "TEXT DEFAULT 'pendiente'");
  ensureColumn(db, "municipio_comercial", "proxima_accion_completada_at", "TEXT");
  db.exec("CREATE INDEX IF NOT EXISTS idx_municipio_comercial_clasificacion ON municipio_comercial(clasificacion)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_municipio_comercial_servicio ON municipio_comercial(servicio)");
  ensureColumn(db, "trabajo_tareas", "municipio_id", "TEXT REFERENCES municipios(id) ON DELETE SET NULL");
  db.exec("CREATE INDEX IF NOT EXISTS idx_trabajo_tareas_municipio ON trabajo_tareas(municipio_id)");
  ensureColumn(db, "trabajo_okr_resultados", "avance", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "trabajo_okr_resultados", "meta", "INTEGER NOT NULL DEFAULT 1");
  ensureColumn(db, "trabajo_okr_resultados", "unidad", "TEXT");
  return db;
}

module.exports = {
  DB_PATH,
  openDb
};
