const Database = require('better-sqlite3');

class SQLiteDB {
    constructor() {
        this.connection = new Database('configurations/breaksystem.sqlite');
    }

    prepare(sql) {
        return this.connection.prepare(sql);
    }

    transaction(fn) {
        return this.connection.transaction(fn);
    }

    async all(sql, params = []) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.connection.prepare(sql);
                const result = stmt.all(params);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    async get(sql, params = []) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.connection.prepare(sql);
                const result = stmt.get(params);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.connection.prepare(sql);
                const result = stmt.run(params);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    close() {
        this.connection.close();
    }
}

module.exports = new SQLiteDB();
