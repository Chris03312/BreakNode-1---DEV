const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const cache = {
    data: {},
    timestamp: 0,
    ttl: 10 * 60 * 1000 // 10 minutes
};

module.exports = {
    EndorsementData: async (req, res) => {
        try {
            const { Campaign } = req.body;

            if (!Campaign) {
                return res.status(400).json({ success: false, message: 'Campaign is required.' });
            }

            const now = Date.now();
            if (cache.data[Campaign] && now - cache.timestamp < cache.ttl) {
                console.log('📦 Serving data from cache for', Campaign);
                return res.status(200).json({
                    success: true,
                    data: cache.data[Campaign].data,
                    sheet: cache.data[Campaign].sheet,
                    endorsementStatus: cache.data[Campaign].endorsementStatus,
                    latestOldEndorsementDate: cache.data[Campaign].latestOldEndorsementDate
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

            const today = new Date();
            const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${today.getFullYear()}`;

            const basePath = path.resolve(__dirname, `../../endorsement/${dir}`);
            const newPath = path.join(basePath, 'NEW');
            const oldPath = path.join(basePath, 'OLD');

            let selectedPath = oldPath;
            let endorsementStatus = 'Old Endorsement';

            // Get latest date from OLD folder
            let latestDate = null;
            let latestDateFormatted = 'No valid date found';
            if (fs.existsSync(oldPath)) {
                const oldFiles = fs.readdirSync(oldPath).filter(f =>
                    f.endsWith('.xlsx') && !f.startsWith('~$')
                );

                for (const file of oldFiles) {
                    const match = file.match(/(\d{8})/); // Match MMDDYYYY
                    if (match) {
                        const dateStr = match[1];
                        const mm = parseInt(dateStr.substring(0, 2), 10);
                        const dd = parseInt(dateStr.substring(2, 4), 10);
                        const yyyy = parseInt(dateStr.substring(4, 8), 10);
                        const fileDate = new Date(yyyy, mm - 1, dd);
                        if (!latestDate || fileDate > latestDate) {
                            latestDate = fileDate;
                        }
                    }
                }

                if (latestDate) {
                    latestDateFormatted = `${String(latestDate.getMonth() + 1).padStart(2, '0')}/${String(latestDate.getDate()).padStart(2, '0')}/${latestDate.getFullYear()}`;
                }
            }

            // Check NEW path for newer files
            if (fs.existsSync(newPath)) {
                const newFiles = fs.readdirSync(newPath).filter(f =>
                    f.endsWith('.xlsx') &&
                    !f.startsWith('~$') &&
                    f.includes(formattedDate)
                );

                if (newFiles.length > 0) {
                    selectedPath = newPath;
                    endorsementStatus = 'New Endorsement';
                    console.log(`📂 Using NEW ENDORSEMENT for ${Campaign}`);
                } else {
                    console.log(`📂 No files dated ${formattedDate} found in NEW ENDORSEMENT. Using OLD ENDORSEMENT.`);
                }
            } else {
                console.warn(`⚠️ NEW folder does not exist at ${newPath}`);
            }

            if (!fs.existsSync(selectedPath)) {
                return res.status(200).json({ success: true, data: [] });
            }

            const files = fs.readdirSync(selectedPath).filter(f =>
                f.endsWith('.xlsx') && !f.startsWith('~$')
            );

            const allData = [];

            for (const fileName of files) {
                const filePath = path.join(selectedPath, fileName);
                const workbook = new ExcelJS.Workbook();

                try {
                    await workbook.xlsx.readFile(filePath);
                } catch (err) {
                    console.error(`❌ Error reading file "${fileName}":`, err.message);
                    continue;
                }

                const worksheet = workbook.getWorksheet(sheet);
                if (!worksheet) {
                    console.warn(`⚠️ Sheet "${sheet}" not found in file "${fileName}"`);
                    continue;
                }

                const headerRow = worksheet.getRow(1);
                const headers = [];
                headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    headers.push(cell?.value ?? `Column${colNumber}`);
                });

                worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                    if (rowNumber === 1) return;

                    const rowData = {};
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        const key = headers[colNumber - 1] ?? `Column${colNumber}`;
                        rowData[key] = cell?.value ?? '';
                    });

                    allData.push(rowData);
                });
            }

            // Cache the result
            cache.data[Campaign] = {
                data: allData,
                sheet,
                endorsementStatus,
                latestOldEndorsementDate: latestDateFormatted
            };
            cache.timestamp = now;

            return res.status(200).json({
                success: true,
                data: allData,
                sheet,
                endorsementStatus,
                latestOldEndorsementDate: latestDateFormatted
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
