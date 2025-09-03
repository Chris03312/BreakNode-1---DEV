const Database = require('better-sqlite3');
const db = new Database('sms_queue.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS sms_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    message TEXT NOT NULL
  )
`);

module.exports = db;
