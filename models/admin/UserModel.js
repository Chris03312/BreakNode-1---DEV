const connection = require('../../configurations/database');

const UsersModel = {
    AgentsData: async () => {
        const sql = 'SELECT * FROM agents';
        return await connection.all('usersystem', sql);
    },
    AgentInsertData: async (UserId, Name, Password, Campaign) => {
        const sql = `INSERT INTO agents (id, name, password, campaign, status, createdAt) VALUES (?, ?, ?, ?, ?, datetime('now'))`;
        return await connection.run('usersystem', sql, [UserId, Name, Password, Campaign, 'Enable']);
    },
    AgentsEditData: async (id) => {
        const sql = 'SELECT * FROM agents WHERE id = ?';
        return await connection.all('usersystem', sql, [id]);
    },
    AgentEditUser: async (UserId, Name, Password, Campaign, Status) => {
        const sql = 'UPDATE agents SET name = ?, password = ?, campaign = ?, status = ? WHERE id = ?';
        return await connection.run('usersystem', sql, [Name, Password, Campaign, Status, UserId]);
    },
    AgentDeleteUser: async (id) => {
        const sql = 'DELETE FROM agents WHERE id = ?';
        return await connection.run('usersystem', sql, [id]);
    },
    AgentsWithoutSchedule: async () => {
        const agents = await connection.all('usersystem', 'SELECT id, name FROM agents');
        const scheduled = await connection.all('breaksystem', 'SELECT id FROM schedule');
        const scheduledSet = new Set(scheduled.map(s => s.id));
        return agents.filter(agent => !scheduledSet.has(agent.id));
    },
    GetAgentData: async (UserId) => {
        const sql = 'SELECT * FROM agents WHERE id = ?';
        return await connection.all('usersystem', sql, [UserId]);
    }
};

module.exports = UsersModel;