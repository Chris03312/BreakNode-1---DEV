const connection = require('../../configurations/database');

const AuthenticationModel = {
    AccessAdminData: async (UserId) => {
        const sql = 'SELECT * FROM admin WHERE id = ?';
        return connection.all('usersystem', sql, [UserId]);
    },

    LoginLogs: async (UserId, Name) => {
        const sql = `
        INSERT INTO logs (accountId, name, date, loginAt, status) VALUES (?, ?, DATE('now', '+8 hours'), TIME('now', '+8 hours'), ?)`;
        return connection.run('usersystem', sql, [String(UserId), Name, 'Active']);
    },
}

module.exports = AuthenticationModel;