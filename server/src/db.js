const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, "..", "data", "database.sqlite");

function openDb() {
  const db = new DatabaseSync(DB_PATH, {
    open: true,
    readOnly: false
  });
  db.exec("PRAGMA foreign_keys = ON");
  return db;
}

module.exports = {
  DB_PATH,
  openDb
};
