const connection = require('../../configurations/database');

const EmailRequestModel = {
    EmailRequestData: async () => {
        const sql = 'SELECT * FROM emailrequest';
        return await connection.all('usersystem', sql);
    },
}

module.exports = EmailRequestModel;