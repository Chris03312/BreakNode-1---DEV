const connection = require('../../configurations/database');

const EmailRequestModel = {
    EmailRequestData: async () => {
        const sql = 'SELECT * FROM emailrequest';
        return await connection.all('usersystem', sql);
    },
    UpdateEmailRemarks: async (AgentId, Email) => {
        const sql = `UPDATE emailrequest SET remarks = ? WHERE agentId = ? AND email = ? AND DATE(date) = DATE('now')`;
        return await connection.run('usersystem', sql, ['Sent', AgentId, Email]);
    },
    UpdateConfirmedEmail: async (AgentId, Email, ConfirmedAmount) => {
        const sql = `UPDATE emailrequest SET confirmedAmount = ?, remarks = ? WHERE agentId = ? and email = ?AND DATE(date, 'localtime') =  DATE('now', 'localtime')`;
        return await connection.run('usersystem', sql, [ConfirmedAmount, 'Confirmed', AgentId, Email]);
    }
}

module.exports = EmailRequestModel;