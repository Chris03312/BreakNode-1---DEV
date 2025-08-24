const connection = require('../../configurations/database');

const SimCardLoadingModel = {
    LoadRequestData: async () => {
        const sql = 'SELECT * FROM loadrequest';
        return await connection.all('usersystem', sql);
    },
    CountSimRequests: async () => {
        const sql = `
        SELECT COUNT(*) AS total,
            SUM(CASE WHEN campaign LIKE 'MEC%' THEN 1 ELSE 0 END) AS mec,
            SUM(CASE WHEN campaign LIKE 'MPL%' THEN 1 ELSE 0 END) AS mpl,
            SUM(CASE WHEN campaign LIKE 'SMS%' THEN 1 ELSE 0 END) AS sms
        FROM loadrequest
        WHERE remarks = 'Pending' AND DATE(date, 'localtime') = DATE('now', 'localtime')
    `;
        return await connection.all('usersystem', sql);
    },
    ConfirmLoadRequests: async (AgentId, Campaign, MobileNumber) => {
        const sql = `UPDATE loadrequest SET remarks = ?, loadAt = DATETIME('now', 'localtime') WHERE agentId = ? AND campaign = ? AND mobileNumber = ?`;
        return await connection.run('usersystem', sql, ['Done', AgentId, Campaign, MobileNumber]);
    },
    Notification: async (AgentId, Description) => {
        const sql = `INSERT INTO notification (role, agentId, Description, status, datetime) VALUES (?,?,?,?, DATETIME('now', 'localtime'))`;
        return await connection.run('usersystem', sql, ['Admin', AgentId, Description, 'unread']);
    }
}

module.exports = SimCardLoadingModel;