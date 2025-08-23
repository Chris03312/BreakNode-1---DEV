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
        WHERE remarks = 'Pending'
    `;
        return await connection.all('usersystem', sql);
    }
}

module.exports = SimCardLoadingModel;