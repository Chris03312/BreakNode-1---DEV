// configurations/database.js

const Database = require('better-sqlite3');

const dbMap = {
    usersystem: new Database('configurations/usersystem.sqlite'),
    breaksystem: new Database('configurations/breaksystem.sqlite'),
};

const getConnection = (dbName) => {
    const db = dbMap[dbName];
    if (!db) {
        throw new Error(`Database '${dbName}' not found.`);
    }
    return db;
};

const connection = {
    async all(dbName, sql, params = []) {
        try {
            const db = getConnection(dbName);
            const stmt = db.prepare(sql);
            return stmt.all(params);
        } catch (err) {
            throw err;
        }
    },

    async run(dbName, sql, params = []) {
        try {
            const db = getConnection(dbName);
            const stmt = db.prepare(sql);
            return stmt.run(params);
        } catch (err) {
            throw err;
        }
    },

    async get(dbName, sql, params = []) {
        try {
            const db = getConnection(dbName);
            const stmt = db.prepare(sql);
            return stmt.get(params);
        } catch (err) {
            throw err;
        }
    },

    closeAll() {
        for (const db of Object.values(dbMap)) {
            db.close();
        }
    }
};

module.exports = connection;
