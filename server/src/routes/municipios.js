const express = require("express");

const COMMERCIAL_FIELDS = [
  "estado_comercial",
  "proxima_accion",
  "proxima_accion_descripcion",
  "fecha_proxima_accion",
  "notas",
  "prioridad",
  "clasificacion",
  "subclasificacion",
  "servicio",
  "ojos_en_alerta"
];

const FIELD_LIMITS = {
  estado_comercial: 80,
  proxima_accion: 300,
  proxima_accion_descripcion: 2000,
  fecha_proxima_accion: 10,
  notas: 5000,
  prioridad: 50,
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
    proxima_accion_descripcion: row.proxima_accion_descripcion,
    fecha_proxima_accion: row.fecha_proxima_accion,
    proxima_accion_estado: row.proxima_accion_estado,
    proxima_accion_completada_at: row.proxima_accion_completada_at,
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

  router.get("/proximas-acciones", (_req, res) => {
    const rows = db.prepare(`
      SELECT
        mc.municipio_id,
        m.nombre AS municipio_nombre,
        mc.proxima_accion AS titulo,
        mc.proxima_accion_descripcion AS descripcion,
        mc.fecha_proxima_accion AS fecha,
        COALESCE(mc.proxima_accion_estado, 'pendiente') AS estado
      FROM municipio_comercial mc
      JOIN municipios m ON m.id = mc.municipio_id
      WHERE mc.proxima_accion IS NOT NULL
        AND COALESCE(mc.proxima_accion_estado, 'pendiente') = 'pendiente'
      ORDER BY
        CASE WHEN mc.fecha_proxima_accion IS NULL THEN 1 ELSE 0 END,
        mc.fecha_proxima_accion,
        m.nombre COLLATE NOCASE
    `).all();
    res.json(rows);
  });

  router.get("/", (_req, res) => {
    const rows = db
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
           mc.proxima_accion_descripcion,
           mc.fecha_proxima_accion,
           mc.proxima_accion_estado,
           mc.proxima_accion_completada_at,
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
         ORDER BY m.nombre COLLATE NOCASE`
      )
      .all();

    res.json(rows.map(parseMunicipioWithComercial));
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
           mc.proxima_accion_descripcion,
           mc.fecha_proxima_accion,
           mc.proxima_accion_estado,
           mc.proxima_accion_completada_at,
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
    next.sistema_actual = current.sistema_actual ?? null;
    const actionWasEdited = ["proxima_accion", "proxima_accion_descripcion", "fecha_proxima_accion"]
      .some((field) => validation.payload[field] !== undefined);
    next.proxima_accion_estado = actionWasEdited && next.proxima_accion
      ? "pendiente"
      : current.proxima_accion_estado ?? "pendiente";
    next.proxima_accion_completada_at = actionWasEdited ? null : current.proxima_accion_completada_at ?? null;

    db.prepare(
      `INSERT INTO municipio_comercial (
         municipio_id,
         estado_comercial,
         proxima_accion,
         proxima_accion_descripcion,
         fecha_proxima_accion,
         proxima_accion_estado,
         proxima_accion_completada_at,
         notas,
         prioridad,
         sistema_actual,
         clasificacion,
         subclasificacion,
         servicio,
         ojos_en_alerta,
         updated_at
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(municipio_id) DO UPDATE SET
         estado_comercial = excluded.estado_comercial,
         proxima_accion = excluded.proxima_accion,
         proxima_accion_descripcion = excluded.proxima_accion_descripcion,
         fecha_proxima_accion = excluded.fecha_proxima_accion,
         proxima_accion_estado = excluded.proxima_accion_estado,
         proxima_accion_completada_at = excluded.proxima_accion_completada_at,
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
      next.proxima_accion_descripcion,
      next.fecha_proxima_accion,
      next.proxima_accion_estado,
      next.proxima_accion_completada_at,
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
           proxima_accion_descripcion,
           fecha_proxima_accion,
           proxima_accion_estado,
           proxima_accion_completada_at,
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

  router.patch("/:id/proxima-accion/finalizar", (req, res) => {
    const result = db.prepare(`
      UPDATE municipio_comercial
      SET proxima_accion_estado = 'finalizada',
          proxima_accion_completada_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE municipio_id = ? AND proxima_accion IS NOT NULL
    `).run(req.params.id);

    if (!result.changes) {
      res.status(404).json({ error: "Próxima acción no encontrada" });
      return;
    }
    res.json({ ok: true });
  });

  router.delete("/:id/proxima-accion", (req, res) => {
    const result = db.prepare(`
      UPDATE municipio_comercial
      SET proxima_accion = NULL,
          proxima_accion_descripcion = NULL,
          fecha_proxima_accion = NULL,
          proxima_accion_estado = 'pendiente',
          proxima_accion_completada_at = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE municipio_id = ? AND proxima_accion IS NOT NULL
    `).run(req.params.id);

    if (!result.changes) {
      res.status(404).json({ error: "Próxima acción no encontrada" });
      return;
    }
    res.json({ ok: true });
  });

  return router;
};
