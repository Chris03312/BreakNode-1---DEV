const connection = require('../../configurations/database');

const UsersModel = {
    AgentsData: async () => {
        const sql = 'SELECT * FROM schedule';
        return await connection.all('breaksystem', sql);
    },
    GetAgentsScheduleData: async (AgentId) => {
        const sql = 'SELECT * FROM schedule WHERE id = ?';
        return await connection.all('breaksystem', sql, [AgentId]);
    },
    AgentsWithoutSchedule: async () => {
        const agents = await connection.all('usersystem', 'SELECT id, name FROM agents');
        const scheduled = await connection.all('breaksystem', 'SELECT id FROM schedule');
        const scheduledSet = new Set(scheduled.map(s => String(s.id)));  // Convert schedule ids to strings
        return agents.filter(agent => !scheduledSet.has(String(agent.id))); // Also convert agent ids to strings
    },
    AgentInsertScheduleDatas: async (UserId, Name, Campaign, FffBreak, FftBreak, ToneHour, FoneHour, SffBreak, SftBreak) => {
        const sql = 'INSERT INTO schedule (id, name, campaign, FffBreak, FftBreak, ToneHour, FoneHour, SffBreak, SftBreak) VALUES (?,?,?,?,?,?,?,?,?)';
        return await connection.run('breaksystem', sql, [UserId, Name, Campaign, FffBreak, FftBreak, FoneHour, ToneHour, SffBreak, SftBreak]);
    },
    AgentEditScheduleDatas: async (id) => {
        const sql = 'SELECT * FROM schedule WHERE id = ?';
        return await connection.all('breaksystem', sql, [id]);
    },
    AgentUpdateScheduleDatas: async (agentId, FffBreak, FftBreak, ToneHour, FoneHour, SffBreak, SftBreak) => {
        const sql = 'UPDATE schedule SET FffBreak = ?, FftBreak = ?, ToneHour = ?, FoneHour = ?, SffBreak = ?, SftBreak = ? WHERE id = ?';
        return await connection.run('breaksystem', sql, [FffBreak, FftBreak, ToneHour, FoneHour, SffBreak, SftBreak, agentId])
    },
    AgentDeleteScheduleDatas: async (id) => {
        const sql = 'DELETE FROM schedule WHERE id = ?';
        return await connection.run('breaksystem', sql, [id]);
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
    },

};

module.exports = UsersModel;