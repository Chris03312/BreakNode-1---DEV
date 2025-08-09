const connection = require('../../configurations/database');

const AuthenticationModel = {
    AccessAdminData: async () => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        return connection.all(sql);
    },


}

module.exports = AuthenticationModel;