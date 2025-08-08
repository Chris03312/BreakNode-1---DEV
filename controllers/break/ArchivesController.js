const ArchivesModel = require('../../models/break/ArchivesModel');
const path = require('path');
const fs = require('fs');

const ArchiveController = {
    ArchivesData: async (req, res) => {
        try {
            const archives = await ArchivesModel.ArchivesData();

            const dates = archives.map(archive => archive.date);

            if (dates && dates.length > 0) {
                return res.status(200).json({
                    success: true,
                    dates: dates
                });
            } else {
                return res.status(200).json({
                    success: false,
                    message: 'No archive dates found.'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during fetching Archives Data.'
            });
        }
    },

    ArchivesDataByDate: async (req, res) => {
        let { date } = req.body;

        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        try {
            const records = await ArchivesModel.ArchivesByDate(formattedDate);

            if (records && records.length > 0) {
                return res.status(200).json({
                    success: true,
                    records: records
                });
            } else {
                return res.status(200).json({
                    success: false,
                    message: 'No records found for the selected date.'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during fetching Archives Data by Date.'
            });
        }
    },

    download: async (req, res) => {
        const { date } = req.body;
        if (!date) return res.status(400).send('Missing date.');

        const archiveDir = path.join(__dirname, '../archives/');
        const filePath = path.join(archiveDir, `archive_${date}.csv`);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).send('Archive file not found.');
            }

            res.setHeader('Content-Disposition', `attachment; filename=archive_${date}.csv`);
            res.setHeader('Content-Type', 'text/csv');

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        });
    }
}

module.exports = ArchiveController;