const connection = require('../../configurations/database');

const EmailRequestModel = {
    EmailRequestData: async () => {
        const sql = 'SELECT * FROM emailrequest';
        return await connection.all('usersystem', sql);
    },
    UpdateEmailRemarks: async (AgentId, Campaign, AccountNumber) => {
        const sql = `UPDATE emailrequest SET remarks = ? WHERE agentId = ? AND campaign = ? AND accountNumber = ? AND DATE(date, 'localtime') =  DATE('now', 'localtime')`;
        return await connection.run('usersystem', sql, ['Sent', AgentId, Campaign, AccountNumber]);
    },
    UpdateConfirmedEmail: async (AgentId, AccountNumber, ConfirmedAmount) => {
        const sql = `UPDATE emailrequest SET confirmedAmount = ?, remarks = ? WHERE agentId = ? and accountNumber = ? AND DATE(date, 'localtime') =  DATE('now', 'localtime')`;
        return await connection.run('usersystem', sql, [ConfirmedAmount, 'Confirmed', AgentId, AccountNumber]);
    }
}

module.exports = EmailRequestModel;