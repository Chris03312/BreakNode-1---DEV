// models/AuthenticationModel.js
const connection = require('../../configurations/database');

const AuthenticationModel = {
    AccessAdminUser: async (UserId) => {
        const sql = 'SELECT id, password FROM admin WHERE id = ?';
        return await connection.all(sql, [UserId]);
    }
};

module.exports = AuthenticationModel;
