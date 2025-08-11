const connection = require('../../configurations/database');

const UsersModel = {
    AgentsData: async () => {
        const sql = 'SELECT * FROM agents';
        return await connection.all('usersystem', sql);
    }
};

module.exports = UsersModel;