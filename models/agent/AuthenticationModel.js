const connection = require('../../configurations/database');

const AuthenticationModel = {
    AccessAgentData: async (UserId) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        return connection.all(sql, [UserId]);
    },

    LoginLogs: async (UserId, Name, Campaign) => {
        const sql = `
        INSERT INTO logs (userId, name, campaign, date, logsAt, status) VALUES (?, ?, ?, DATE('now', '+8 hours'), TIME('now', '+8 hours'), ?)`;
        return connection.run(sql, [String(UserId), Name, Campaign, 'Active']);
    },
}

module.exports = AuthenticationModel;