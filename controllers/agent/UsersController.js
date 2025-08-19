const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const cache = {
    data: {},      // cache data keyed by Campaign
    timestamp: 0,  // last cache update time
    ttl: 10 * 60 * 1000 // 10 hours // BUT IF YOU RESTART OR CNTRL S IN THE SOURCE CODE IT WILL RESET THE CACHE 10 * 60 * 60 & 1000 for 10 hours
};

const UsersController = {
    EndorsementData: async (req, res) => {
        try {
            const { Campaign } = req.body;

            if (!Campaign) {
                return res.status(400).json({ success: false, message: 'Campaign is required.' });
            }

            const now = Date.now();
            if (
                cache.data[Campaign] &&
                now - cache.timestamp < cache.ttl
            ) {
                console.log('Serving data from cache for', Campaign);
                return res.status(200).json({
                    success: true,
                    data: cache.data[Campaign].data,
                    sheet: cache.data[Campaign].sheet
                });
            }

            const campaignMap = {
                'MEC 1 - 30': { sheet: '1-30DPD', dir: 'MEC' },
                'MEC 61 AND UP': { sheet: '61ANDUP', dir: 'MEC' },
                'MEC 121 AND UP': { sheet: '121ANDUP', dir: 'MEC' },
                'MPL 1 - 30': { sheet: '1-30DPD', dir: 'MPL' },
                'MPL 91 AND UP': { sheet: '91ANDUP', dir: 'MPL' },
            };

            const campaignInfo = campaignMap[Campaign];
            if (!campaignInfo) {
                return res.status(400).json({ success: false, message: 'Invalid campaign name.' });
            }

            const { sheet, dir } = campaignInfo;
            const folderPath = path.resolve(__dirname, `../../endorsement/${dir}`);

            // If folder doesn't exist, respond with empty data
            if (!fs.existsSync(folderPath)) {
                return res.status(200).json({ success: true, data: [] });
            }

            // Read all Excel files (exclude temp files starting with ~$)
            const files = fs.readdirSync(folderPath).filter(f =>
                f.endsWith('.xlsx') && !f.startsWith('~$')
            );

            const allData = [];

            for (const fileName of files) {
                const filePath = path.join(folderPath, fileName);
                const workbook = new ExcelJS.Workbook();

                try {
                    await workbook.xlsx.readFile(filePath);
                } catch (err) {
                    console.error(`❌ Error reading file "${fileName}":`, err.message);
                    continue; // skip this file and continue with others
                }

                const worksheet = workbook.getWorksheet(sheet);
                if (!worksheet) {
                    console.warn(`⚠️ Sheet "${sheet}" not found in file "${fileName}"`);
                    continue; // skip if sheet missing
                }

                // Read header row including empty cells
                const headerRow = worksheet.getRow(1);
                const headers = [];
                headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    headers.push(cell?.value ?? `Column${colNumber}`);
                });

                // Read each row including empty cells
                worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                    if (rowNumber === 1) return; // skip header row

                    const rowData = {};
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        const key = headers[colNumber - 1] ?? `Column${colNumber}`;
                        rowData[key] = cell?.value ?? '';
                    });

                    allData.push(rowData);
                });
            }

            // Cache the data so next requests are faster
            cache.data[Campaign] = { data: allData, sheet };
            cache.timestamp = now;

            // Send the data back
            return res.status(200).json({
                success: true,
                data: allData,
                sheet
            });

        } catch (error) {
            console.error('🔥 Server error while reading endorsement data:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while reading endorsement sheets.'
            });
        }
    }
};

module.exports = UsersController;
