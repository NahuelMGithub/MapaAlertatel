const express = require("express");

const TASK_STATES = ["pendiente", "completada"];
const PRIORITIES = ["baja", "media", "alta"];
const OKR_STATES = ["borrador", "activo", "cerrado"];

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

function isValidMonth(value) {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

function nextMonth(value) {
  const [year, month] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month, 1));
  return date.toISOString().slice(0, 7);
}

function getRequestDate(req) {
  const fecha = req.query.fecha || todayDate();

  if (!isValidDateOnly(fecha)) {
    return { error: "fecha debe tener formato YYYY-MM-DD" };
  }

  return { fecha };
}

function getRequestMonth(req) {
  const mes = req.query.mes || todayDate().slice(0, 7);

  if (!isValidMonth(mes)) {
    return { error: "mes debe tener formato YYYY-MM" };
  }

  return { mes };
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
    municipio_id: row.municipio_id,
    municipio_nombre: row.municipio_nombre || null,
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

function parseOkr(db, okrRow) {
  if (!okrRow) {
    return null;
  }

  const resultados = db
    .prepare(
      `SELECT id, mes, titulo, descripcion, avance, meta, unidad, orden, created_at, updated_at
       FROM trabajo_okr_resultados
       WHERE mes = ?
       ORDER BY orden ASC, id ASC`
    )
    .all(okrRow.mes);

  return {
    mes: okrRow.mes,
    objetivo: okrRow.objetivo,
    descripcion: okrRow.descripcion,
    estado: okrRow.estado,
    resultados,
    created_at: okrRow.created_at,
    updated_at: okrRow.updated_at
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
    const municipio_id = normalizeText(body.municipio_id, "municipio_id", { max: 120 }) || null;
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

    return { payload: { titulo, descripcion, municipio_id, fecha, estado, prioridad } };
  } catch (error) {
    return { error: error.message };
  }
}

function validateOkrPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El body debe ser un objeto JSON" };
  }

  try {
    const mes = body.mes || todayDate().slice(0, 7);
    const objetivo = normalizeText(body.objetivo, "objetivo", { required: true, max: 220 });
    const descripcion = normalizeText(body.descripcion, "descripcion", { max: 800 }) || null;
    const estado = body.estado || "borrador";

    if (!isValidMonth(mes)) {
      return { error: "mes debe tener formato YYYY-MM" };
    }

    if (!OKR_STATES.includes(estado)) {
      return { error: "estado debe ser borrador, activo o cerrado" };
    }

    if (!Array.isArray(body.resultados)) {
      return { error: "resultados debe ser una lista" };
    }

    const resultados = body.resultados
      .map((resultado, index) => {
        if (!resultado || typeof resultado !== "object" || Array.isArray(resultado)) {
          throw new Error("Cada resultado debe ser un objeto JSON");
        }

        const titulo = normalizeText(resultado.titulo, `resultado ${index + 1}`, { max: 180 });
        const descripcionResultado = normalizeText(resultado.descripcion, `descripcion resultado ${index + 1}`, { max: 500 }) || null;
        const avance = resultado.avance === undefined || resultado.avance === "" ? 0 : Number(resultado.avance);
        const meta = resultado.meta === undefined || resultado.meta === "" ? 1 : Number(resultado.meta);
        const unidad = normalizeText(resultado.unidad, `unidad resultado ${index + 1}`, { max: 40 }) || null;

        if (!titulo) {
          return null;
        }

        if (!Number.isInteger(avance) || avance < 0) {
          throw new Error(`avance resultado ${index + 1} debe ser un entero mayor o igual a 0`);
        }

        if (!Number.isInteger(meta) || meta < 1) {
          throw new Error(`meta resultado ${index + 1} debe ser un entero mayor o igual a 1`);
        }

        return {
          titulo,
          descripcion: descripcionResultado,
          avance,
          meta,
          unidad,
          orden: index + 1
        };
      })
      .filter(Boolean);

    if (resultados.length === 0) {
      return { error: "Debe cargar al menos un resultado clave" };
    }

    return { payload: { mes, objetivo, descripcion, estado, resultados } };
  } catch (error) {
    return { error: error.message };
  }
}

function validateOkrClosePayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El body debe ser un objeto JSON" };
  }

  const mes = body.mes || todayDate().slice(0, 7);

  if (!isValidMonth(mes)) {
    return { error: "mes debe tener formato YYYY-MM" };
  }

  return { payload: { mes } };
}

function validateTaskPatch(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El body debe ser un objeto JSON" };
  }

  try {
    const payload = {
      titulo: normalizeText(body.titulo, "titulo", { max: 180 }),
      descripcion: normalizeText(body.descripcion, "descripcion", { max: 1000 }),
      municipio_id: normalizeText(body.municipio_id, "municipio_id", { max: 120 })
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
  return db
    .prepare(
      `SELECT tt.*, m.nombre AS municipio_nombre
       FROM trabajo_tareas tt
       LEFT JOIN municipios m ON m.id = tt.municipio_id
       WHERE tt.id = ?`
    )
    .get(id);
}

function completionTimestampForDate(fecha) {
  return `${fecha}T${new Date().toISOString().slice(11)}`;
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

  router.get("/okr", (req, res) => {
    const monthResult = getRequestMonth(req);

    if (monthResult.error) {
      res.status(400).json({ error: monthResult.error });
      return;
    }

    const row = db
      .prepare(
        `SELECT mes, objetivo, descripcion, estado, created_at, updated_at
         FROM trabajo_okr_mensual
         WHERE mes = ?`
      )
      .get(monthResult.mes);

    res.json({
      mes: monthResult.mes,
      okr: parseOkr(db, row)
    });
  });

  router.put("/okr", (req, res) => {
    const validation = validateOkrPayload(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    db.exec("BEGIN");

    try {
      db.prepare(
        `INSERT INTO trabajo_okr_mensual (mes, objetivo, descripcion, estado, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(mes) DO UPDATE SET
           objetivo = excluded.objetivo,
           descripcion = excluded.descripcion,
           estado = excluded.estado,
           updated_at = CURRENT_TIMESTAMP`
      ).run(
        validation.payload.mes,
        validation.payload.objetivo,
        validation.payload.descripcion,
        validation.payload.estado
      );

      db.prepare("DELETE FROM trabajo_okr_resultados WHERE mes = ?").run(validation.payload.mes);

      const insertResultado = db.prepare(
        `INSERT INTO trabajo_okr_resultados (mes, titulo, descripcion, avance, meta, unidad, orden, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      );

      validation.payload.resultados.forEach((resultado) => {
        insertResultado.run(
          validation.payload.mes,
          resultado.titulo,
          resultado.descripcion,
          resultado.avance,
          resultado.meta,
          resultado.unidad,
          resultado.orden
        );
      });

      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }

    const row = db
      .prepare(
        `SELECT mes, objetivo, descripcion, estado, created_at, updated_at
         FROM trabajo_okr_mensual
         WHERE mes = ?`
      )
      .get(validation.payload.mes);

    res.json(parseOkr(db, row));
  });

  router.post("/okr/cerrar", (req, res) => {
    const validation = validateOkrClosePayload(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const current = db
      .prepare(
        `SELECT mes, objetivo, descripcion, estado, created_at, updated_at
         FROM trabajo_okr_mensual
         WHERE mes = ?`
      )
      .get(validation.payload.mes);

    if (!current) {
      res.status(404).json({ error: "OKR mensual no encontrado" });
      return;
    }

    const currentOkr = parseOkr(db, current);
    const nextMes = nextMonth(validation.payload.mes);

    db.exec("BEGIN");

    try {
      db.prepare(
        `UPDATE trabajo_okr_mensual
         SET estado = 'cerrado', updated_at = CURRENT_TIMESTAMP
         WHERE mes = ?`
      ).run(validation.payload.mes);

      const nextExists = db.prepare("SELECT mes FROM trabajo_okr_mensual WHERE mes = ?").get(nextMes);

      if (!nextExists) {
        db.prepare(
          `INSERT INTO trabajo_okr_mensual (mes, objetivo, descripcion, estado, updated_at)
           VALUES (?, ?, ?, 'borrador', CURRENT_TIMESTAMP)`
        ).run(nextMes, currentOkr.objetivo, currentOkr.descripcion);

        const insertResultado = db.prepare(
          `INSERT INTO trabajo_okr_resultados (mes, titulo, descripcion, avance, meta, unidad, orden, updated_at)
           VALUES (?, ?, ?, 0, ?, ?, ?, CURRENT_TIMESTAMP)`
        );

        currentOkr.resultados.forEach((resultado) => {
          insertResultado.run(
            nextMes,
            resultado.titulo,
            resultado.descripcion,
            resultado.meta || 1,
            resultado.unidad,
            resultado.orden
          );
        });
      }

      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }

    const closedRow = db
      .prepare(
        `SELECT mes, objetivo, descripcion, estado, created_at, updated_at
         FROM trabajo_okr_mensual
         WHERE mes = ?`
      )
      .get(validation.payload.mes);
    const nextRow = db
      .prepare(
        `SELECT mes, objetivo, descripcion, estado, created_at, updated_at
         FROM trabajo_okr_mensual
         WHERE mes = ?`
      )
      .get(nextMes);

    res.json({
      cerrado: parseOkr(db, closedRow),
      siguiente: parseOkr(db, nextRow)
    });
  });

  router.get("/tareas", (req, res) => {
    const dateResult = getRequestDate(req);

    if (dateResult.error) {
      res.status(400).json({ error: dateResult.error });
      return;
    }

    const municipioId = typeof req.query.municipio_id === "string" && req.query.municipio_id.trim()
      ? req.query.municipio_id.trim()
      : null;
    const params = [];
    const whereParts = [];

    if (municipioId) {
      whereParts.push("tt.municipio_id = ?");
      params.push(municipioId);
    } else {
      whereParts.push(
        `((tt.estado = 'pendiente' AND tt.fecha <= ?)
          OR (tt.estado = 'completada' AND (
            tt.fecha = ?
            OR (tt.completada_at IS NOT NULL AND substr(tt.completada_at, 1, 10) = ?)
          )))`
      );
      params.push(dateResult.fecha, dateResult.fecha, dateResult.fecha);
    }

    const rows = db
      .prepare(
        `SELECT tt.*, m.nombre AS municipio_nombre
         FROM trabajo_tareas tt
         LEFT JOIN municipios m ON m.id = tt.municipio_id
         WHERE ${whereParts.join(" AND ")}
         ORDER BY
           CASE WHEN tt.fecha < ? AND tt.estado = 'pendiente' THEN 0 ELSE 1 END,
           CASE WHEN tt.estado = 'completada' THEN 1 ELSE 0 END,
           tt.fecha ASC,
           CASE tt.prioridad WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END,
           tt.id ASC`
      )
      .all(...params, dateResult.fecha);

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

    const completadaAt = validation.payload.estado === "completada"
      ? completionTimestampForDate(validation.payload.fecha)
      : null;
    const result = db
      .prepare(
        `INSERT INTO trabajo_tareas (municipio_id, titulo, descripcion, fecha, estado, prioridad, completada_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
      .run(
        validation.payload.municipio_id,
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
      municipio_id: validation.payload.municipio_id === undefined ? current.municipio_id : validation.payload.municipio_id,
      fecha: validation.payload.fecha === undefined ? current.fecha : validation.payload.fecha,
      estado: validation.payload.estado === undefined ? current.estado : validation.payload.estado,
      prioridad: validation.payload.prioridad === undefined ? current.prioridad : validation.payload.prioridad
    };

    let completadaAt = current.completada_at;

    if (next.estado === "completada" && current.estado !== "completada") {
      completadaAt = completionTimestampForDate(next.fecha);
    }

    if (next.estado === "pendiente") {
      completadaAt = null;
    }

    db.prepare(
      `UPDATE trabajo_tareas
       SET municipio_id = ?, titulo = ?, descripcion = ?, fecha = ?, estado = ?, prioridad = ?, completada_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(next.municipio_id, next.titulo, next.descripcion, next.fecha, next.estado, next.prioridad, completadaAt, req.params.id);

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
    const completadaAt = validation.payload.completado ? completionTimestampForDate(validation.payload.fecha) : null;

    db.prepare(
      `UPDATE trabajo_tareas
       SET estado = ?, completada_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(estado, completadaAt, req.params.id);

    res.json(parseTask(getTaskById(db, req.params.id)));
  });

  return router;
};
