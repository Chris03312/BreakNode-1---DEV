const connection = require('../../configurations/database');

const ArchivesModel = {
    ArchivesData: async () => {
        const sql = 'SELECT DISTINCT DATE(date) AS date FROM archives ORDER BY date DESC';
        return await connection.all(sql);
    },
    ArchivesByDate: async (date) => {
        const sql = 'SELECT * FROM archives WHERE DATE(date) = ?';
        return await connection.all(sql, [date]);
    }
}

module.exports = ArchivesModel;