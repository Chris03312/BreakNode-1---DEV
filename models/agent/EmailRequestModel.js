const connection = require('../../configurations/database');

const EmailRequestModel = {
    InsertEmailRequest: async (AgentInsertData, agentName, Campaign, Email, ClientName, MobileNumber, Amount, AccountNumber, Request, dpd) => {
        const sql = `INSERT INTO emailrequest (date, agentId, agentName, campaign, email, clientName, mobileNumber, amount, accountNumber, request, remarks, dpd, requestedAt) VALUES (DATE('now', 'localtime'),?,?,?,?,?,?,?,?,?,?,?, DATETIME('now', '+8 hours'))`;
        return await connection.run('usersystem', sql, [AgentInsertData, agentName, Campaign, Email, ClientName, MobileNumber, Amount, AccountNumber, Request, 'Pending', dpd,]
        );
    },
    InsertViberRequest: async (AgentInsertData, agentName, Campaign, ClientName, MobileNumber, Amount, AccountNumber, Request, dpd) => {
        const sql = `INSERT INTO emailrequest (date, agentId, agentName, campaign, email, clientName, mobileNumber, amount, accountNumber, request, remarks, dpd, requestedAt) VALUES (DATE('now', 'localtime'),?,?,?,?,?,?,?,?,?,?,?, DATETIME('now', '+8 hours'))`;
        return await connection.run('usersystem', sql, [AgentInsertData, agentName, Campaign, 'Non-Email', ClientName, MobileNumber, Amount, AccountNumber, Request, 'Pending', dpd]
        );
    },
    EmailRequestData: async (AgentId, Campaign) => {
        const sql = `SELECT * FROM emailrequest WHERE agentId = ? AND campaign = ?`;
        return await connection.all('usersystem', sql, [AgentId, Campaign]);
    },
    CheckExistingEmail: async (Reqemail) => {
        const sql = `SELECT * FROM emailrequest WHERE email = ? AND (remarks = 'Pending' OR remarks = 'Sent' OR remarks = 'Confirmed') AND DATE(date, 'localtime') = DATE('now', 'localtime')`;
        return await connection.all('usersystem', sql, [Reqemail]);
    },
    CheckExistingViber: async (Reqemail) => {
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
    },
    AgentReEmailRequest: async (AgentId, Campaign, Email, Amount, Dpd, AccountNumber) => {
        const sql = `UPDATE emailrequest SET remarks = ?, Amount = ?, dpd = ?, date = DATE('now', 'localtime') WHERE agentId = ? AND campaign = ? AND email = ? AND accountNumber = ? AND DATE(date) < DATE('now', 'localtime')`;
        return await connection.run('usersystem', sql, ['Pending', Amount, Dpd, AgentId, Campaign, Email, AccountNumber]);
    },
    CountEmailRequests: async (AgentId, Campaign, TargetDate) => {
        const sql = `
        SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN remarks = 'Confirmed' THEN 1 ELSE 0 END) AS confirmed
        FROM emailrequest
        WHERE agentId = ? 
          AND campaign = ? 
          AND DATE(date, 'localtime') = ?
    `;
        return await connection.all('usersystem', sql, [AgentId, Campaign, TargetDate]);
    }
}
module.exports = EmailRequestModel;