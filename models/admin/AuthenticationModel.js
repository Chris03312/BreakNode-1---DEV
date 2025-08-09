const connection = require('../../configurations/database');

const AuthenticationModel = {
    AccessAdminData: async (UserId) => {
        const sql = 'SELECT * FROM admin WHERE id = ?';
        return connection.all(sql, [UserId]);
    },


}

module.exports = AuthenticationModel;