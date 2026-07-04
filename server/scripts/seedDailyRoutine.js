const { openDb } = require("../src/db");

const INITIAL_ITEMS = [
  "Anotar tareas diarias",
  "Chats Bitrix",
  "Gmail",
  "Email Jula",
  "WhatsApp Jula",
  "Bitrix Soporte",
  "Bitrix Producto",
  "Bitrix Desarrollo"
];

const db = openDb();

const insertItem = db.prepare(`
  INSERT INTO ritual_items (titulo, orden, activo, updated_at)
  VALUES (?, ?, 1, CURRENT_TIMESTAMP)
  ON CONFLICT DO NOTHING
`);

const existingByTitle = db.prepare("SELECT id FROM ritual_items WHERE titulo = ?");

db.exec("BEGIN");

try {
  INITIAL_ITEMS.forEach((titulo, index) => {
    if (!existingByTitle.get(titulo)) {
      insertItem.run(titulo, index + 1);
    }
  });

  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

const total = db.prepare("SELECT COUNT(*) AS total FROM ritual_items WHERE activo = 1").get().total;
db.close();

console.log(`Items iniciales de ritual disponibles: ${total}`);
