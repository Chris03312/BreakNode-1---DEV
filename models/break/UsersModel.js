const connection = require('../../configurations/database');

const UsersModel = {
    UsersData: async () => {
        const sql = 'SELECT * FROM users';
        return await connection.all(sql);
    },
    SearchData: async (searchTerm) => {
        const likeSearch = `%${searchTerm}%`;
        const sql = 'SELECT * FROM users WHERE name LIKE ? OR campaign LIKE ? OR id LIKE ?';
        return await connection.all(sql, [likeSearch, likeSearch, likeSearch]);
    },
    InsertData: async (UserId, Name, Campaign, Password, FffBreak, FftBreak, ToneHour, FoneHour, SffBreak, SftBreak) => {
        const sql = 'INSERT INTO users (id, name, campaign, password, FffBreak, FftBreak, ToneHour, FoneHour, SffBreak, SftBreak, overBreak, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ? )';
        return await connection.run(sql, [UserId, Name, Campaign, Password, FffBreak, FftBreak, ToneHour, FoneHour, SffBreak, SftBreak, 'Enable']);
    },
    EditData: async (id) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        return await connection.all(sql, [id]);
    },
    UpdateUser: async (UserId, Name, Campaign, Password) => {
        const sql = 'UPDATE users SET name = ?, campaign = ?, password = ? WHERE id = ?';
        return await connection.run(sql, [Name, Campaign, Password, UserId]);
    },
    UpdateSchedule: async (UserId, FffBreak, FftBreak, FoneHour, ToneHour, SffBreak, SftBreak) => {
        const sql = 'UPDATE users SET FffBreak = ?, FftBreak = ?, FoneHour = ?, ToneHour = ?, SffBreak = ?, SftBreak = ? WHERE id = ?';
        return await connection.run(sql, [FffBreak, FftBreak, FoneHour, ToneHour, SffBreak, SftBreak, UserId]);
    },
    DeleteUser: async (UserId) => {
        const sql = 'DELETE FROM users WHERE id = ?';
        return await connection.run(sql, [UserId]);
    }
};

module.exports = UsersModel;