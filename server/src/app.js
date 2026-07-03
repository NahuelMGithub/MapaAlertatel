const express = require("express");
const cors = require("cors");
const { openDb } = require("./db");
const municipiosRouter = require("./routes/municipios");

function createApp(db = openDb()) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/municipios", municipiosRouter(db));

  app.use((req, res) => {
    res.status(404).json({ error: "Endpoint no encontrado", path: req.path });
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  });

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3001);
  const app = createApp();

  app.listen(port, () => {
    console.log(`Servidor local escuchando en http://localhost:${port}`);
  });
}

module.exports = {
  createApp
};
