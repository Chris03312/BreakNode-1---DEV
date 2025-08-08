const connection = require('../../configurations/database');

const AuthenticationModel = {
    AccessAgentData: async () => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        return connection.all(sql);
    },

    
}

module.exports = AuthenticationModel;