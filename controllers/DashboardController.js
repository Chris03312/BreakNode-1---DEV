const DashboardModel = require('../models/DashboardModel');

const DashboardController = {
    runArchiveSync: async () => {
        try {
            const records = await DashboardModel.ArchiveRecords();

            if (!records || records.length === 0) {
                return { success: false, message: 'No records to archive.' };
            }

            const filePath = await DashboardModel.ExportToFileSync(records);
            DashboardModel.ArchiveAndDeleteSync(records);

            return {
                success: true,
                message: `${records.length} record(s) archived.`,
                archiveFile: filePath
            };
        } catch (err) {
            return { success: false, message: 'Error during archive: ' + err.message };
        }
    }
};


module.exports = DashboardController;
