const Database = require('better-sqlite3');
const path = require('path');

// Create or open the SQLite file
const connection = new Database(path.resolve(__dirname, 'breaksystem.sqlite'));

// Create tables if they don't exist
connection.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    PASSWORD TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS archives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    campaign TEXT,
    date TEXT,
    breakType TEXT,
    breakOut TEXT,
    breakIn TEXT,
    timeDifference TEXT,
    remarks TEXT,
    archivedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    campaign TEXT,
    date TEXT,
    breakType TEXT,
    breakOut TEXT,
    breakIn TEXT,
    timeDifference TEXT,
    remarks TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    campaign TEXT,
    password TEXT,
    FffBreak TEXT,
    FftBreak TEXT,
    FoneHour TEXT,
    ToneHour TEXT,
    SffBreak TEXT,
    SftBreak TEXT,
    overBreak INTEGER,
    status TEXT
  );
`);

console.log('Tables created (if not already existing).');

// Export only after setup
module.exports = connection;
