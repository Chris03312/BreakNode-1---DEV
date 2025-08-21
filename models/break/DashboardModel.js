const connection = require('../../configurations/database');
const path = require('path');
const fs = require('fs');

const DashboardModel = {
    ArchiveRecords: async () => {
        const sql = `SELECT * FROM records WHERE DATE(date) < DATE('now')`;
        return await connection.all('breaksystem', sql);
    },

    ExportToFileSync: async (records) => {
        const archiveDir = path.join(__dirname, '../../archives');
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
        }

        const sql = `SELECT date FROM records LIMIT 1`;
        const recordsData = await connection.all(sql);

        const fileDate = recordsData[0]?.date || new Date().toISOString().split('T')[0];
        const filePath = path.join(archiveDir, `archive_${fileDate}.csv`);

        const headers = [
            'name',
            'campaign',
            '15 Minutes Break',
            '1 Hour Break',
            '10 Minutes Break',
            'timeDifference',
            'remarks',
            'date'
        ];

        let content = headers.join(',') + '\n';
        const grouped = {};

        records.forEach(record => {
            const key = `${record.userId}-${record.date}`;

            const dateObj = new Date(record.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            });

            if (!grouped[key]) {
                grouped[key] = {
                    name: record.name,
                    campaign: record.campaign,
                    break15: [],
                    break1hr: [],
                    break10: [],
                    date: formattedDate
                };
            }

            const breakRange = `${record.breakOut} - ${record.breakIn}`;

            if (record.breakType === '15 Minutes Break') {
                grouped[key].break15.push(breakRange);
            } else if (record.breakType === '1 Hour Break') {
                grouped[key].break1hr.push(breakRange);
            } else if (record.breakType === '10 Minutes Break') {
                grouped[key].break10.push(breakRange);
            }
        });

        for (const key in grouped) {
            const data = grouped[key];
            const row = [
                data.name || '',
                data.campaign || '',
                data.break15.join('; '),
                data.break1hr.join('; '),
                data.break10.join('; '),
                '', // placeholder for timeDifference
                '', // placeholder for remarks
                data.date || ''
            ];
            content += row.join(',') + '\n';
        }

        fs.writeFileSync(filePath, content);
        return filePath;
    },

    ArchiveAndDeleteSync: (records) => {
        if (!records || records.length === 0) return;

        const keys = Object.keys(records[0]);
        const insertSQL = `INSERT INTO archives (${keys.join(', ')}) VALUES (${keys.map(k => `@${k}`).join(', ')})`;
        const insertStmt = connection.prepare('breaksystem', insertSQL);
        const deleteStmt = connection.prepare('breaksystem', `DELETE FROM records WHERE DATE(date) < DATE('now')`);

        const transaction = connection.transaction((rows) => {
            for (const row of rows) {
                insertStmt.run(row);
            }
            deleteStmt.run();
        });

        transaction(records);
    },

};

module.exports = DashboardModel;
