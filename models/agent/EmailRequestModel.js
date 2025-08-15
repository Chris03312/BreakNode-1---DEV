const connection = require('../../configurations/database');

const EmailRequestModel = {
    InsertEmailRequest: async (AgentInsertData, agentName, Campaign, Email, ClientName, MobileNumber, Amount, AccountNumber, Request) => {
        const sql = `INSERT INTO emailrequest (date, agentId, agentName, campaign, email, clientName, mobileNumber, amount, accountNumber, request, remarks, requestedAt) VALUES (DATE('now'),?,?,?,?,?,?,?,?,?,?, TIME('now', '+8 hours'))`;
        return await connection.run('usersystem', sql, [AgentInsertData, agentName, Campaign, Email, ClientName, MobileNumber, Amount, AccountNumber, Request, 'Pending']
        );
    },
    EmailRequestData: async (AgentId, Campaign) => {
        const sql = `SELECT * FROM emailrequest WHERE agentId = ? AND campaign = ? AND DATE(date, 'localtime') = DATE('now', 'localtime')`;
        return await connection.all('usersystem', sql, [AgentId, Campaign]);
    },
    CheckExistingEmail: async (Reqemail) => {
        const sql = `SELECT * FROM emailrequest WHERE email = ? AND (remarks = 'Pending' OR remarks = 'Sent' OR remarks = 'Confirmed') AND DATE(date, 'localtime') = DATE('now', 'localtime')`;
        return await connection.all('usersystem', sql, [Reqemail]);
    },
    EmailEditRequestData: async (AgentId, AccountNumber, request) => {
        if (request === 'Proof of Payment') {
            const sql = `SELECT * FROM emailrequest WHERE agentId = ? AND accountNumber = ? AND request = ? AND DATE(date, 'localtime') = DATE('now', 'localtime')`;
            return await connection.all('usersystem', sql, [AgentId, AccountNumber, request]);
        } else if (request === 'Viber Request') {
            const sql = `SELECT * FROM emailrequest WHERE agentId = ? AND accountNumber = ? AND request = ? AND DATE(date, 'localtime') = DATE('now', 'localtime')`;
            return await connection.all('usersystem', sql, [AgentId, AccountNumber, request]);
        }
    },
    AgentEmailUpdateDatas: async (AgentId, Campaign, reqeditemail, reqeditclient, reqeditmobile, reqeditamount, reqeditaccount, reqeditdetails) => {
        const sql = 'UPDATE emailrequest SET email = ?, clientName = ?, mobileNumber = ?, amount = ?, request = ? WHERE accountNumber = ? AND AgentId = ? AND campaign = ?';
        return await connection.run('usersystem', sql, [reqeditemail, reqeditclient, reqeditmobile, reqeditamount, reqeditdetails, reqeditaccount, AgentId, Campaign]);
    }
}

module.exports = EmailRequestModel;