const connection = require('../../configurations/database');

const BreaksModel = {
    // BREAKS MIDDLEWARE BREAK IN
    CheckBreakOut: async (UserIdIn, BreakTypeIn) => {
        const sql = `SELECT * FROM records WHERE accountId = ? AND breakType = ? AND breakIn IS NULL AND DATE(date) = DATE('now')`;
        return await connection.all('breaksystem', sql, [UserIdIn, BreakTypeIn]);
    },
    CheckBreakOutnIn: async (UserIdIn, BreakTypeIn) => {
        const sql = `SELECT * FROM records WHERE accountId = ? AND breakType = ? AND breakOut IS NOT NULL AND breakIn IS NOT NULL AND DATE(date) = DATE('now')`;
        return await connection.all('breaksystem', sql, [UserIdIn, BreakTypeIn]);
    },

    //BREAK MIDDELWARE BREAK OUT
    CheckActiveBreakOut: async (UserIdOut) => {
        const sql = 'SELECT breakType FROM records WHERE accountId = ? AND breakOut IS NOT NULL AND breakIn is NULL';
        return await connection.all('breaksystem', sql, [UserIdOut]);
    },
    CheckBreakInnOut: async (UserIdOut, BreakTypeOut) => {
        const sql = `SELECT breakType FROM records WHERE accountId = ? and breakType = ? AND DATE(date) = DATE('now') AND breakOut is NOT NULL AND breakIn IS NOT NULL`;
        return await connection.all('breaksystem', sql, [UserIdOut, BreakTypeOut]);
    },

    // BREAK / AGENT CONTROLLER 
    Records: async () => {
        const sql = 'SELECT * FROM records';
        return await connection.all('breaksystem', sql);
    },
    CheckAgentStatus: async (id) => {
        const sql = 'SELECT status FROM agents WHERE id = ?'
        return await connection.all('usersystem', sql, [id]);
    },
    CheckSchedule: async (id) => {
        const sql = 'SELECT FffBreak, FftBreak, FoneHour, ToneHour, SffBreak, SftBreak FROM schedule WHERE id = ?';
        return await connection.all('breaksystem', sql, [id]);
    },
    CheckBreakOutActive: async () => {
        const sql = 'SELECT breakType FROM records WHERE breakOut IS NOT NULL';
        return await connection.all('breaksystem', sql);
    },

    // LOGIN SCHEDULE COLORCODING
    CheckBreakActive: async () => {
        const sql = `SELECT remarks, breakType, accountId FROM records WHERE breakOut IS NOT NULL AND Date(date) = DATE('now')`;
        return await connection.all('breaksystem', sql);
    },

    // BREAK DETAILS FETCH
    BreakDetails: async (UserIdOut) => {
        const sql = 'SELECT * FROM schedule WHERE id = ?';
        return await connection.all('breaksystem', sql, [UserIdOut]);
    },

    // BREAK OUT
    BreakOut: async (UserIdOut, name, campaign, breakTypeOut) => {
        const sql = `INSERT INTO records (accountId, name, campaign, date, breakType, breakOut, remarks) 
                 VALUES (?, ?, ?, DATE('now'), ?, TIME('now', '+8 hours'), ?)`;
        return await connection.run('breaksystem', sql, [UserIdOut, name, campaign, breakTypeOut, 'Active']);
    },

    // BREAK IN
    BreakIn: async (UserIdIn, BreakTypeIn) => {
        const sql = `UPDATE records SET breakIn = TIME('now', '+8 hours') WHERE accountId = ? AND breakType = ? AND breakIn IS NULL`;
        return await connection.run('breaksystem', sql, [UserIdIn, BreakTypeIn]);
    },
    TimeDifference: async (UserIdIn, BreakTypeIn) => {
        const sql = `SELECT breakOut, breakIn FROM records WHERE accountId = ? AND breakType = ? AND DATE(date) = DATE('now') ORDER BY id DESC LIMIT 1`;
        return await connection.all('breaksystem', sql, [UserIdIn, BreakTypeIn]);
    },
    RemarksAndTimeDifference: async (UserIdIn, BreakTypeIn, TimeDifference, Remarks, Reason) => {
        const sql = `UPDATE records SET timeDifference = ?, remarks = ?, dispositions = ? WHERE accountId = ? AND breakType = ? AND DATE(date) = DATE('now') ORDER BY id DESC LIMIT 1`;
        return await connection.run('breaksystem', sql, [TimeDifference, Remarks, Reason, UserIdIn, BreakTypeIn]);
    },
    IncrementOverBreak: async (UserIdIn) => {
        const sql = 'UPDATE schedule SET overBreak = overBreak + 1 WHERE id = ?';
        return await connection.run('breaksystem', sql, [UserIdIn]);
    },
    GetOverBreakCount: async (UserIdIn) => {
        const sql = 'SELECT overBreak FROM schedule WHERE id = ?';
        return await connection.all('breaksystem', sql, [UserIdIn]);
    },
    DisableUser: async (UserIdIn) => {
        const sql = 'UPDATE schedule SET status = "Disabled" WHERE id = ?';
        return await connection.run('breaksystem', sql, [UserIdIn]);
    },

    // AGENT MIDDLEWARES
    BreakDetailsWithPassword: async (id) => {
        const sql = 'SELECT * FROM schedule WHERE id = ?'
        return await connection.all('breaksystem', sql, [id]);
    },
}

module.exports = BreaksModel;