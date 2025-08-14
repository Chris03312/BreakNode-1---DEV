const connection = require('../../configurations/database');

const EmailRequestModel = {
    InsertEmailRequest: async (AgentInsertData, agentName, Campaign, Email, ClientName, MobileNumber, Amount, AccountNumber, Request) => {
        const sql = `INSERT INTO emailrequest (date, agentId, agentName, campaign, email, clientName, mobileNumber, amount, accountNumber, request, remarks) VALUES (DATE('now'),?,?,?,?,?,?,?,?,?,?)`;
        return await connection.run('usersystem', sql, [AgentInsertData, agentName, Campaign, Email, ClientName, MobileNumber, Amount, AccountNumber, Request, 'Pending']
        );
    },
    EmailRequestData: async (AgentId) => {
        const sql = `SELECT * FROM emailrequest WHERE agentId = ? AND DATE(date, 'localtime') = DATE('now', 'localtime')`;
        return await connection.all('usersystem', sql, [AgentId]);
    }
}

module.exports = EmailRequestModel;