const connection = require('../../configurations/database');

const SimCardLoadingModel = {
    Notification: async (AgentId, Description) => {
        const sql = `INSERT INTO notification (role, agentId, description, status, datetime) VALUES (?, ?, ?, ?, DATETIME('now', 'localtime'))`;
        return await connection.run('usersystem', sql, ['Agent', AgentId, Description, 'unread']);
    },
    InsertLoadRequests: async (AgentId, AgentName, Campaign, reqloadmobile, reqloadpurpose) => {
        const sql = `INSERT INTO loadrequest (date, agentId, agentName, Campaign, mobileNumber, loadPurposes, remarks) VALUES (DATE('now', 'localtime'),?,?,?,?,?,?)`;
        return await connection.run('usersystem', sql, [AgentId, AgentName, Campaign, reqloadmobile, reqloadpurpose, 'Pending']);
    },
    CheckExistingEmail: async (Reqemail) => {
        const sql = `SELECT * FROM emailrequest WHERE email = ? AND (remarks = 'Pending' OR remarks = 'Sent' OR remarks = 'Confirmed') AND DATE(date, 'localtime') = DATE('now', 'localtime')`;
        return await connection.all('usersystem', sql, [Reqemail]);
    },
    checkExistingNumber: async (reqloadmobile) => {
        const sql = `SELECT mobileNumber FROM loadrequest WHERE mobileNumber = ? AND DATE(date, 'localtime') = DATE('now', 'localtime')`;
        return await connection.all('usersystem', sql, [reqloadmobile]);
    }
}

module.exports = SimCardLoadingModel