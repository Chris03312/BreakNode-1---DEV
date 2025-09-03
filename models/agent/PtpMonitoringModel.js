const connection = require('../../configurations/database');

const PtpMonitoringModel = {
    GetPtpDatas: async (AgentId, Campaign) => {
        const sql = `SELECT * FROM ptpmonitoring WHERE AgentId = ? AND Campaign = ?`;
        return await connection.all('usersystem', sql, [AgentId, Campaign]);
    },
    CheckDuplicatePtps: async (AgentId, Campaign, PtpAccountNumber) => {
        const sql = `SELECT * FROM ptpmonitoring WHERE agentId = ? AND campaign = ? AND accountNumber = ? AND DATE(datetime, 'localtime') = DATE('date', 'localtime')`;
        return await connection.all('usersystem', sql, [AgentId, Campaign, PtpAccountNumber]);
    },
    InsertPtpsDatas: async (ClientName, PtpEmail, PtpAccountNumber, PtpMobileNumber, PtpAmount, PtpDpd, AgentName, AgentId, Campaign) => {
        const sql = `INSERT INTO ptpmonitoring (agentId, datetime, agentName, campaign, clientName, emailAddress, mobileNumber, accountNumber, amount, ptpDpd, ptpDate)
        VALUES (?, DATETIME('now', 'localtime'), ?,?,?,?,?,?,?,?, DATE('now', 'localtime'))`;
        return await connection.run('usersystem', sql, [AgentId, AgentName, Campaign, ClientName, PtpEmail, PtpMobileNumber, PtpAccountNumber, PtpAmount, PtpDpd]);
    },
    CountPtpsPerAgent: async (AgentId, Campaign) => {
        const sql = `
        SELECT 
          'agent' AS scope, COUNT(id) AS PTPCOUNT, SUM(amount) AS PTPAMOUNT FROM ptpmonitoring WHERE agentId = ? AND campaign = ? AND DATE(datetime, 'localtime') = DATE('now', 'localtime')
        UNION
        SELECT 'campaign' AS scope, COUNT(id) AS PTPCOUNT, SUM(amount) AS PTPAMOUNT FROM ptpmonitoring WHERE campaign = ? AND DATE(datetime, 'localtime') = DATE('now', 'localtime')`;
        return await connection.all('usersystem', sql, [AgentId, Campaign, Campaign]);
    },
    CountConfirmedPtps: async (AgentId, Campaign) => {
        const sql = `
        SELECT
            'agent' AS scope, SUM(confirmedAmount) AS CONFIRMEDAMOUNT FROM emailrequest WHERE agendId = ? AND campaign = ? AND DATE(datetime, 'localtime') = DATE('now', 'localtime')
        UNION
        SELECT 'campaign' AS scope, SUM(confirmedAmount) AS TOTALAMOUNT FROM emailRequest WHERE DATE(datetime, 'localtime') = DATE('now', 'localtime')`;
        return await connection.all('usersystem', sql, [AgentId, Campaign]);
    }

}

module.exports = PtpMonitoringModel;