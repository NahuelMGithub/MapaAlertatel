const fs = require("node:fs");
const path = require("node:path");
const { openDb } = require("../src/db");

const municipiosPath = path.join(__dirname, "..", "..", "data", "municipios.json");

function toNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function requireMunicipioId(municipio, index) {
  const id = municipio.Cod_Gl_Res144_Indec;

  if (!id) {
    throw new Error(`Municipio sin Cod_Gl_Res144_Indec en indice ${index}`);
  }

  return String(id);
}

const raw = fs.readFileSync(municipiosPath, "utf8");
const municipios = JSON.parse(raw);

if (!Array.isArray(municipios)) {
  throw new Error("data/municipios.json debe contener un array");
}

const db = openDb();

const insertMunicipio = db.prepare(`
  INSERT INTO municipios (
    id,
    nombre,
    departamento,
    provincia,
    estado,
    politico,
    intendente,
    poblacion,
    lat,
    long,
    raw_json,
    updated_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(id) DO UPDATE SET
    nombre = excluded.nombre,
    departamento = excluded.departamento,
    provincia = excluded.provincia,
    estado = excluded.estado,
    politico = excluded.politico,
    intendente = excluded.intendente,
    poblacion = excluded.poblacion,
    lat = excluded.lat,
    long = excluded.long,
    raw_json = excluded.raw_json,
    updated_at = CURRENT_TIMESTAMP
`);

db.exec("BEGIN");

try {
  for (const [index, municipio] of municipios.entries()) {
    insertMunicipio.run(
      requireMunicipioId(municipio, index),
      municipio.nombre || municipio.Departamento || "Sin nombre",
      municipio.Departamento || null,
      municipio.Provincia || null,
      municipio.estado || null,
      municipio.politico || null,
      municipio.intendente || null,
      municipio.poblacion || null,
      toNumber(municipio.lat),
      toNumber(municipio.long),
      JSON.stringify(municipio)
    );
  }

  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

const total = db.prepare("SELECT COUNT(*) AS total FROM municipios").get().total;
db.close();

console.log(`Municipios importados: ${municipios.length}`);
console.log(`Total en SQLite: ${total}`);
