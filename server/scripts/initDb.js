const fs = require("node:fs");
const path = require("node:path");
const { DB_PATH, openDb } = require("../src/db");

const schemaPath = path.join(__dirname, "..", "schema.sql");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const schema = fs.readFileSync(schemaPath, "utf8");
const db = openDb();

db.exec(schema);
db.close();

console.log(`Base de datos inicializada en ${DB_PATH}`);
