const express = require("express");

const COMMERCIAL_FIELDS = [
  "estado_comercial",
  "proxima_accion",
  "fecha_proxima_accion",
  "notas",
  "prioridad",
  "sistema_actual",
  "clasificacion",
  "subclasificacion",
  "servicio",
  "ojos_en_alerta"
];

const FIELD_LIMITS = {
  estado_comercial: 80,
  proxima_accion: 300,
  fecha_proxima_accion: 10,
  notas: 5000,
  prioridad: 50,
  sistema_actual: 200,
  clasificacion: 20,
  subclasificacion: 40,
  servicio: 200
};

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

function parseMunicipioWithComercial(row) {
  const municipio = parseRawMunicipio(row);

  municipio.comercial = {
    estado_comercial: row.estado_comercial,
    proxima_accion: row.proxima_accion,
    fecha_proxima_accion: row.fecha_proxima_accion,
    notas: row.notas,
    prioridad: row.prioridad,
    sistema_actual: row.sistema_actual,
    clasificacion: row.clasificacion,
    subclasificacion: row.subclasificacion,
    servicio: row.servicio,
    ojos_en_alerta: row.ojos_en_alerta === null ? null : Boolean(row.ojos_en_alerta),
    created_at: row.comercial_created_at,
    updated_at: row.comercial_updated_at
  };

  return municipio;
}

function normalizeTextField(value, field) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`${field} debe ser texto o null`);
  }

  const normalized = value.trim();
  const limit = FIELD_LIMITS[field];

  if (normalized.length > limit) {
    throw new Error(`${field} no puede superar ${limit} caracteres`);
  }

  return normalized || null;
}

function normalizeBooleanField(value, field) {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value !== "boolean") {
    throw new Error(`${field} debe ser booleano o null`);
  }

  return value;
}

function isValidDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateCommercialPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El body debe ser un objeto JSON" };
  }

  const unknownFields = Object.keys(body).filter((field) => !COMMERCIAL_FIELDS.includes(field));

  if (unknownFields.length > 0) {
    return { error: `Campos no permitidos: ${unknownFields.join(", ")}` };
  }

  const payload = {};

  try {
    for (const field of COMMERCIAL_FIELDS) {
      payload[field] =
        field === "ojos_en_alerta"
          ? normalizeBooleanField(body[field], field)
          : normalizeTextField(body[field], field);
    }
  } catch (error) {
    return { error: error.message };
  }

  if (Object.values(payload).every((value) => value === undefined)) {
    return { error: "Debe enviar al menos un campo comercial para actualizar" };
  }

  if (payload.fecha_proxima_accion && !isValidDateOnly(payload.fecha_proxima_accion)) {
    return { error: "fecha_proxima_accion debe tener formato YYYY-MM-DD" };
  }

  if (payload.clasificacion && !["Cliente", "No cliente"].includes(payload.clasificacion)) {
    return { error: "clasificacion debe ser Cliente, No cliente o null" };
  }

  if (payload.subclasificacion && payload.subclasificacion !== "Prospecto") {
    return { error: "subclasificacion debe ser Prospecto o null" };
  }

  return { payload };
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
        `SELECT
           m.id,
           m.nombre,
           m.departamento,
           m.provincia,
           m.estado,
           m.politico,
           m.intendente,
           m.poblacion,
           m.lat,
           m.long,
           m.raw_json,
           mc.estado_comercial,
           mc.proxima_accion,
           mc.fecha_proxima_accion,
           mc.notas,
           mc.prioridad,
           mc.sistema_actual,
           mc.clasificacion,
           mc.subclasificacion,
           mc.servicio,
           mc.ojos_en_alerta,
           mc.created_at AS comercial_created_at,
           mc.updated_at AS comercial_updated_at
         FROM municipios m
         LEFT JOIN municipio_comercial mc ON mc.municipio_id = m.id
         WHERE m.id = ?`
      )
      .get(req.params.id);

    if (!row) {
      res.status(404).json({ error: "Municipio no encontrado" });
      return;
    }

    res.json(parseMunicipioWithComercial(row));
  });

  router.patch("/:id/comercial", (req, res) => {
    const municipio = db.prepare("SELECT id FROM municipios WHERE id = ?").get(req.params.id);

    if (!municipio) {
      res.status(404).json({ error: "Municipio no encontrado" });
      return;
    }

    const validation = validateCommercialPayload(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const current =
      db.prepare("SELECT * FROM municipio_comercial WHERE municipio_id = ?").get(req.params.id) || {};
    const next = {};

    for (const field of COMMERCIAL_FIELDS) {
      next[field] = validation.payload[field] === undefined ? current[field] ?? null : validation.payload[field];
    }

    db.prepare(
      `INSERT INTO municipio_comercial (
         municipio_id,
         estado_comercial,
         proxima_accion,
         fecha_proxima_accion,
         notas,
         prioridad,
         sistema_actual,
         clasificacion,
         subclasificacion,
         servicio,
         ojos_en_alerta,
         updated_at
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(municipio_id) DO UPDATE SET
         estado_comercial = excluded.estado_comercial,
         proxima_accion = excluded.proxima_accion,
         fecha_proxima_accion = excluded.fecha_proxima_accion,
         notas = excluded.notas,
         prioridad = excluded.prioridad,
         sistema_actual = excluded.sistema_actual,
         clasificacion = excluded.clasificacion,
         subclasificacion = excluded.subclasificacion,
         servicio = excluded.servicio,
         ojos_en_alerta = excluded.ojos_en_alerta,
         updated_at = CURRENT_TIMESTAMP`
    ).run(
      req.params.id,
      next.estado_comercial,
      next.proxima_accion,
      next.fecha_proxima_accion,
      next.notas,
      next.prioridad,
      next.sistema_actual,
      next.clasificacion,
      next.subclasificacion,
      next.servicio,
      next.ojos_en_alerta === null ? null : Number(next.ojos_en_alerta)
    );

    const row = db
      .prepare(
        `SELECT
           municipio_id,
           estado_comercial,
           proxima_accion,
           fecha_proxima_accion,
           notas,
           prioridad,
           sistema_actual,
           clasificacion,
           subclasificacion,
           servicio,
           ojos_en_alerta,
           created_at,
           updated_at
         FROM municipio_comercial
         WHERE municipio_id = ?`
      )
      .get(req.params.id);

    res.json(row);
  });

  return router;
};
