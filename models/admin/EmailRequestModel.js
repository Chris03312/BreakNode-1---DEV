const connection = require('../../configurations/database');

const EmailRequestModel = {
    EmailRequestData: async () => {
        const sql = 'SELECT * FROM emailrequest';
        return await connection.all('usersystem', sql);
    },
    UpdateEmailRemarks: async (AgentId, Campaign, AccountNumber) => {
        const sql = `UPDATE emailrequest SET remarks = ? WHERE agentId = ? AND campaign = ? AND accountNumber = ? AND DATE(date, 'localtime') =  DATE('now', 'localtime') AND confirmedAmount IS NULL`;
        return await connection.run('usersystem', sql, ['Sent', AgentId, Campaign, AccountNumber]);
    },
    UpdateConfirmedEmail: async (ConfirmedAmount, reqemail,) => {
        const sql = `UPDATE emailrequest SET confirmedAmount = ?, remarks = ? WHERE email = ? AND DATE(date, 'localtime') =  DATE('now', 'localtime') AND remarks != 'broken'`;
        return await connection.run('usersystem', sql, [ConfirmedAmount, 'Confirmed', reqemail]);
    },
    UpdateBrokenPTPS: async (agentId, email, clientName, accountNumber) => {
        const sql = `UPDATE emailrequest SET remarks = ? WHERE agentId = ? AND email = ? AND clientName = ? AND accountNumber = ? AND DATE(date, 'localtime') < DATE('now', 'localtime') AND (remarks = 'Pending' OR remarks = 'Sent')`;
        return await connection.run('usersystem', sql, ['Broken', agentId, email, clientName, accountNumber])
    },
    CountEmailRequests: async () => {
        const sql = `
        SELECT COUNT(*) AS total,
            SUM(CASE WHEN campaign LIKE 'MEC%' THEN 1 ELSE 0 END) AS mec,
            SUM(CASE WHEN campaign LIKE 'MPL%' THEN 1 ELSE 0 END) AS mpl
        FROM emailrequest
        WHERE remarks = 'Pending'
    `;
        return await connection.all('usersystem', sql);
    },
    CountSimRequests: async () => {
        const sql = `
        SELECT COUNT(*) AS total,
            SUM(CASE WHEN campaign LIKE 'MEC%' THEN 1 ELSE 0 END) AS mec,
            SUM(CASE WHEN campaign LIKE 'MPL%' THEN 1 ELSE 0 END) AS mpl,
            SUM(CASE WHEN campaign LIKE 'SMS%' THEN 1 ELSE 0 END) AS sms
        FROM loadrequest
        WHERE remarks = 'Pending'
    `;
        return await connection.all('usersystem', sql);
    },
    Notification: async (AgentId, Description) => {
        const sql = `INSERT INTO notification (role, AgentId, Description, status, datetime) VALUES (?,?,?,?, DATETIME('now', 'localtime'))`;
        return await connection.run('usersystem', sql, ['Agent', AgentId, Description, 'unread']);
    }
}

module.exports = EmailRequestModel;