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
    UpdateConfirmedEmail: async (AgentId, AccountNumber, ConfirmedAmount) => {
        const sql = `UPDATE emailrequest SET confirmedAmount = ?, remarks = ? WHERE agentId = ? and accountNumber = ? AND DATE(date, 'localtime') =  DATE('now', 'localtime')`;
        return await connection.run('usersystem', sql, [ConfirmedAmount, 'Confirmed', AgentId, AccountNumber]);
    },
    UpdateBrokenPTPS: async (agentId, email, clientName, accountNumber) => {
        const sql = `UPDATE emailrequest SET remarks = ? WHERE agentId = ? AND email = ? AND clientName = ? AND accountNumber = ? AND DATE(date, 'localtime') < DATE('now', 'localtime') AND remarks = ?`;
        return await connection.run('usersystem', sql, ['Broken', agentId, email, clientName, accountNumber, 'Pending'])
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
    }
}

module.exports = EmailRequestModel;