const express = require("express");

const TASK_STATES = ["pendiente", "completada"];
const PRIORITIES = ["baja", "media", "alta"];

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function isValidDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function getRequestDate(req) {
  const fecha = req.query.fecha || todayDate();

  if (!isValidDateOnly(fecha)) {
    return { error: "fecha debe tener formato YYYY-MM-DD" };
  }

  return { fecha };
}

function normalizeText(value, field, { required = false, max = 300 } = {}) {
  if (value === undefined) {
    if (required) {
      throw new Error(`${field} es obligatorio`);
    }

    return undefined;
  }

  if (value === null) {
    if (required) {
      throw new Error(`${field} es obligatorio`);
    }

    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`${field} debe ser texto`);
  }

  const normalized = value.trim();

  if (required && !normalized) {
    throw new Error(`${field} es obligatorio`);
  }

  if (normalized.length > max) {
    throw new Error(`${field} no puede superar ${max} caracteres`);
  }

  return normalized || null;
}

function normalizeBoolean(value, field) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new Error(`${field} debe ser booleano`);
  }

  return value ? 1 : 0;
}

function parseBoolRow(value) {
  return Boolean(value);
}

function parseRitualItem(row) {
  return {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    orden: row.orden,
    activo: parseBoolRow(row.activo),
    completado: parseBoolRow(row.completado || 0),
    fecha: row.fecha || null,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function parseTask(row) {
  return {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    fecha: row.fecha,
    estado: row.estado,
    prioridad: row.prioridad,
    completada_at: row.completada_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function validateRitualItemCreate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El body debe ser un objeto JSON" };
  }

  try {
    const titulo = normalizeText(body.titulo, "titulo", { required: true, max: 120 });
    const descripcion = normalizeText(body.descripcion, "descripcion", { max: 500 }) || null;
    const orden = body.orden === undefined ? 0 : Number(body.orden);
    const activo = body.activo === undefined ? 1 : normalizeBoolean(body.activo, "activo");

    if (!Number.isInteger(orden) || orden < 0) {
      return { error: "orden debe ser un entero mayor o igual a 0" };
    }

    return { payload: { titulo, descripcion, orden, activo } };
  } catch (error) {
    return { error: error.message };
  }
}

function validateRitualItemPatch(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El body debe ser un objeto JSON" };
  }

  try {
    const payload = {
      titulo: normalizeText(body.titulo, "titulo", { max: 120 }),
      descripcion: normalizeText(body.descripcion, "descripcion", { max: 500 }),
      activo: normalizeBoolean(body.activo, "activo")
    };

    if (body.orden !== undefined) {
      const orden = Number(body.orden);

      if (!Number.isInteger(orden) || orden < 0) {
        return { error: "orden debe ser un entero mayor o igual a 0" };
      }

      payload.orden = orden;
    }

    if (Object.values(payload).every((value) => value === undefined)) {
      return { error: "Debe enviar al menos un campo para actualizar" };
    }

    return { payload };
  } catch (error) {
    return { error: error.message };
  }
}

function validateCheckPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El body debe ser un objeto JSON" };
  }

  try {
    const completado = normalizeBoolean(body.completado, "completado");
    const fecha = body.fecha || todayDate();

    if (completado === undefined) {
      return { error: "completado es obligatorio" };
    }

    if (!isValidDateOnly(fecha)) {
      return { error: "fecha debe tener formato YYYY-MM-DD" };
    }

    return { payload: { completado, fecha } };
  } catch (error) {
    return { error: error.message };
  }
}

function validateTaskCreate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El body debe ser un objeto JSON" };
  }

  try {
    const titulo = normalizeText(body.titulo, "titulo", { required: true, max: 180 });
    const descripcion = normalizeText(body.descripcion, "descripcion", { max: 1000 }) || null;
    const fecha = body.fecha || todayDate();
    const estado = body.estado || "pendiente";
    const prioridad = body.prioridad || "media";

    if (!isValidDateOnly(fecha)) {
      return { error: "fecha debe tener formato YYYY-MM-DD" };
    }

    if (!TASK_STATES.includes(estado)) {
      return { error: "estado debe ser pendiente o completada" };
    }

    if (!PRIORITIES.includes(prioridad)) {
      return { error: "prioridad debe ser baja, media o alta" };
    }

    return { payload: { titulo, descripcion, fecha, estado, prioridad } };
  } catch (error) {
    return { error: error.message };
  }
}

function validateTaskPatch(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El body debe ser un objeto JSON" };
  }

  try {
    const payload = {
      titulo: normalizeText(body.titulo, "titulo", { max: 180 }),
      descripcion: normalizeText(body.descripcion, "descripcion", { max: 1000 })
    };

    if (body.fecha !== undefined) {
      if (!isValidDateOnly(body.fecha)) {
        return { error: "fecha debe tener formato YYYY-MM-DD" };
      }

      payload.fecha = body.fecha;
    }

    if (body.estado !== undefined) {
      if (!TASK_STATES.includes(body.estado)) {
        return { error: "estado debe ser pendiente o completada" };
      }

      payload.estado = body.estado;
    }

    if (body.prioridad !== undefined) {
      if (!PRIORITIES.includes(body.prioridad)) {
        return { error: "prioridad debe ser baja, media o alta" };
      }

      payload.prioridad = body.prioridad;
    }

    if (Object.values(payload).every((value) => value === undefined)) {
      return { error: "Debe enviar al menos un campo para actualizar" };
    }

    return { payload };
  } catch (error) {
    return { error: error.message };
  }
}

function getTaskById(db, id) {
  return db.prepare("SELECT * FROM trabajo_tareas WHERE id = ?").get(id);
}

module.exports = function trabajoRouter(db) {
  const router = express.Router();

  router.get("/ritual", (req, res) => {
    const dateResult = getRequestDate(req);

    if (dateResult.error) {
      res.status(400).json({ error: dateResult.error });
      return;
    }

    const rows = db
      .prepare(
        `SELECT
           ri.id,
           ri.titulo,
           ri.descripcion,
           ri.orden,
           ri.activo,
           ri.created_at,
           ri.updated_at,
           rc.fecha,
           COALESCE(rc.completado, 0) AS completado
         FROM ritual_items ri
         LEFT JOIN ritual_checks rc ON rc.item_id = ri.id AND rc.fecha = ?
         WHERE ri.activo = 1
         ORDER BY ri.orden ASC, ri.id ASC`
      )
      .all(dateResult.fecha);

    res.json({
      fecha: dateResult.fecha,
      items: rows.map(parseRitualItem)
    });
  });

  router.post("/ritual/items", (req, res) => {
    const validation = validateRitualItemCreate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const result = db
      .prepare(
        `INSERT INTO ritual_items (titulo, descripcion, orden, activo, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
      .run(
        validation.payload.titulo,
        validation.payload.descripcion,
        validation.payload.orden,
        validation.payload.activo
      );

    const row = db.prepare("SELECT *, 0 AS completado, NULL AS fecha FROM ritual_items WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(parseRitualItem(row));
  });

  router.patch("/ritual/items/:id", (req, res) => {
    const current = db.prepare("SELECT * FROM ritual_items WHERE id = ?").get(req.params.id);

    if (!current) {
      res.status(404).json({ error: "Item de ritual no encontrado" });
      return;
    }

    const validation = validateRitualItemPatch(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const next = {
      titulo: validation.payload.titulo === undefined ? current.titulo : validation.payload.titulo,
      descripcion: validation.payload.descripcion === undefined ? current.descripcion : validation.payload.descripcion,
      orden: validation.payload.orden === undefined ? current.orden : validation.payload.orden,
      activo: validation.payload.activo === undefined ? current.activo : validation.payload.activo
    };

    db.prepare(
      `UPDATE ritual_items
       SET titulo = ?, descripcion = ?, orden = ?, activo = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(next.titulo, next.descripcion, next.orden, next.activo, req.params.id);

    const row = db.prepare("SELECT *, 0 AS completado, NULL AS fecha FROM ritual_items WHERE id = ?").get(req.params.id);
    res.json(parseRitualItem(row));
  });

  router.patch("/ritual/:itemId/check", (req, res) => {
    const item = db.prepare("SELECT id FROM ritual_items WHERE id = ?").get(req.params.itemId);

    if (!item) {
      res.status(404).json({ error: "Item de ritual no encontrado" });
      return;
    }

    const validation = validateCheckPayload(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    db.prepare(
      `INSERT INTO ritual_checks (item_id, fecha, completado, updated_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(item_id, fecha) DO UPDATE SET
         completado = excluded.completado,
         updated_at = CURRENT_TIMESTAMP`
    ).run(req.params.itemId, validation.payload.fecha, validation.payload.completado);

    const row = db
      .prepare(
        `SELECT
           ri.id,
           ri.titulo,
           ri.descripcion,
           ri.orden,
           ri.activo,
           ri.created_at,
           ri.updated_at,
           rc.fecha,
           rc.completado
         FROM ritual_items ri
         JOIN ritual_checks rc ON rc.item_id = ri.id
         WHERE ri.id = ? AND rc.fecha = ?`
      )
      .get(req.params.itemId, validation.payload.fecha);

    res.json(parseRitualItem(row));
  });

  router.get("/tareas", (req, res) => {
    const dateResult = getRequestDate(req);

    if (dateResult.error) {
      res.status(400).json({ error: dateResult.error });
      return;
    }

    const rows = db
      .prepare(
        `SELECT *
         FROM trabajo_tareas
         WHERE fecha = ?
           AND NOT (estado = 'completada' AND completada_at IS NOT NULL AND substr(completada_at, 1, 10) < ?)
         ORDER BY
           CASE prioridad WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END,
           id ASC`
      )
      .all(dateResult.fecha, dateResult.fecha);

    res.json({
      fecha: dateResult.fecha,
      tareas: rows.map(parseTask)
    });
  });

  router.post("/tareas", (req, res) => {
    const validation = validateTaskCreate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const completadaAt = validation.payload.estado === "completada" ? new Date().toISOString() : null;
    const result = db
      .prepare(
        `INSERT INTO trabajo_tareas (titulo, descripcion, fecha, estado, prioridad, completada_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
      .run(
        validation.payload.titulo,
        validation.payload.descripcion,
        validation.payload.fecha,
        validation.payload.estado,
        validation.payload.prioridad,
        completadaAt
      );

    res.status(201).json(parseTask(getTaskById(db, result.lastInsertRowid)));
  });

  router.patch("/tareas/:id", (req, res) => {
    const current = getTaskById(db, req.params.id);

    if (!current) {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }

    const validation = validateTaskPatch(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const next = {
      titulo: validation.payload.titulo === undefined ? current.titulo : validation.payload.titulo,
      descripcion: validation.payload.descripcion === undefined ? current.descripcion : validation.payload.descripcion,
      fecha: validation.payload.fecha === undefined ? current.fecha : validation.payload.fecha,
      estado: validation.payload.estado === undefined ? current.estado : validation.payload.estado,
      prioridad: validation.payload.prioridad === undefined ? current.prioridad : validation.payload.prioridad
    };

    let completadaAt = current.completada_at;

    if (next.estado === "completada" && current.estado !== "completada") {
      completadaAt = new Date().toISOString();
    }

    if (next.estado === "pendiente") {
      completadaAt = null;
    }

    db.prepare(
      `UPDATE trabajo_tareas
       SET titulo = ?, descripcion = ?, fecha = ?, estado = ?, prioridad = ?, completada_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(next.titulo, next.descripcion, next.fecha, next.estado, next.prioridad, completadaAt, req.params.id);

    res.json(parseTask(getTaskById(db, req.params.id)));
  });

  router.patch("/tareas/:id/check", (req, res) => {
    const current = getTaskById(db, req.params.id);

    if (!current) {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }

    const validation = validateCheckPayload(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const estado = validation.payload.completado ? "completada" : "pendiente";
    const completadaAt = validation.payload.completado ? new Date().toISOString() : null;

    db.prepare(
      `UPDATE trabajo_tareas
       SET estado = ?, completada_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(estado, completadaAt, req.params.id);

    res.json(parseTask(getTaskById(db, req.params.id)));
  });

  return router;
};
