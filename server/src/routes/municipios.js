const express = require("express");

function parseRawMunicipio(row) {
  const raw = JSON.parse(row.raw_json);

  return {
    id: row.id,
    nombre: row.nombre,
    departamento: row.departamento,
    provincia: row.provincia,
    estado: row.estado,
    politico: row.politico,
    intendente: row.intendente,
    poblacion: row.poblacion,
    lat: row.lat,
    long: row.long,
    raw
  };
}

module.exports = function municipiosRouter(db) {
  const router = express.Router();

  router.get("/", (_req, res) => {
    const rows = db
      .prepare(
        `SELECT id, nombre, departamento, provincia, estado, politico, intendente, poblacion, lat, long, raw_json
         FROM municipios
         ORDER BY nombre COLLATE NOCASE`
      )
      .all();

    res.json(rows.map(parseRawMunicipio));
  });

  router.get("/:id", (req, res) => {
    const row = db
      .prepare(
        `SELECT id, nombre, departamento, provincia, estado, politico, intendente, poblacion, lat, long, raw_json
         FROM municipios
         WHERE id = ?`
      )
      .get(req.params.id);

    if (!row) {
      res.status(404).json({ error: "Municipio no encontrado" });
      return;
    }

    res.json(parseRawMunicipio(row));
  });

  return router;
};
