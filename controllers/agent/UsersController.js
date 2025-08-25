const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const cache = {
    data: {},
    timestamp: 0,
    ttl: 1 * 60 * 1000 // 10 minutes
};


const UsersController = {
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
                    const match = file.match(/(\d{8})/);
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
    },
    HardphoneData: async (req, res) => {
        try {
            const { Hardphone, AgentName } = req.body;

            console.log(`📥 Incoming request to /hardphoneData with:`, { Hardphone, AgentName });

            if (!Hardphone || !AgentName) {
                console.warn('⚠️ Missing Hardphone or AgentName in request.');
                return res.status(400).json({ success: false, message: 'Hardphone and AgentName are required.' });
            }

            const harphoneMap = {
                'MEC HARDPHONE 1 - 30': { sheet: '1-30 HARDPHONE', dir: 'MEC' },
                'MEC HARDPHONE 61 AND UP': { sheet: '61 HARDPHONE', dir: 'MEC' },
                'MEC HARDPHONE 121 AND UP': { sheet: '121 HARDPHONE', dir: 'MEC' },
                'MPL HARDPHONE 1 - 30': { sheet: '1-30 HARDPHONE', dir: 'MPL' },
                'MPL HARDPHONE 91 AND UP': { sheet: '91 HARDPHONE', dir: 'MPL' }
            };

            const hardphoneInfo = harphoneMap[Hardphone];
            if (!hardphoneInfo) {
                console.error(`❌ Invalid campaign name: "${Hardphone}"`);
                return res.status(400).json({ success: false, message: 'Invalid campaign name.' });
            }

            const { sheet, dir } = hardphoneInfo;

            const basePath = path.resolve(__dirname, `../../endorsement/${dir}`);
            const newPath = path.join(basePath, 'NEW');
            const oldPath = path.join(basePath, 'OLD');

            console.log(`📂 Searching files in: ${newPath} and ${oldPath}`);

            let latestFile = null;
            let endorsementStatus = 'Old Endorsement';

            const allDirs = [newPath, oldPath];
            for (const dirPath of allDirs) {
                if (!fs.existsSync(dirPath)) {
                    console.warn(`⚠️ Folder does not exist: ${dirPath}`);
                    continue;
                }

                const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));

                for (const file of files) {
                    const match = file.match(/(\d{8})/);
                    if (!match) continue;

                    const fileDate = new Date(
                        parseInt(match[1].substring(4, 8), 10),
                        parseInt(match[1].substring(0, 2), 10) - 1,
                        parseInt(match[1].substring(2, 4), 10)
                    );

                    if (!latestFile || fileDate > latestFile.date) {
                        latestFile = { file, dir: dirPath, date: fileDate };
                        endorsementStatus = dirPath.includes('NEW') ? 'New Endorsement' : 'Old Endorsement';
                    }
                }
            }

            if (!latestFile) {
                console.warn('⚠️ No valid XLSX files found.');
                return res.status(200).json({ success: true, data: [] });
            }

            console.log(`✅ Using file "${latestFile.file}" from "${latestFile.dir}"`);
            console.log(`📄 Target sheet: ${sheet} | Endorsement Status: ${endorsementStatus}`);

            const filePath = path.join(latestFile.dir, latestFile.file);
            const workbook = new ExcelJS.Workbook();

            await workbook.xlsx.readFile(filePath);
            const dataSheet = workbook.getWorksheet(sheet);

            if (!dataSheet) {
                console.error(`❌ Sheet "${sheet}" not found in file "${latestFile.file}"`);
                return res.status(400).json({ success: false, message: `Sheet ${sheet} not found.` });
            }

            const dataHeaders = [];
            const dataRows = [];

            const headerRow = dataSheet.getRow(1);
            headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                dataHeaders.push(cell?.value ?? `Column${colNumber}`);
            });

            dataSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (rowNumber === 1) return;

                const rowData = {};
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    const key = dataHeaders[colNumber - 1] ?? `Column${colNumber}`;
                    rowData[key] = cell?.value ?? '';
                });

                dataRows.push(rowData);
            });

            // 🔍 Filter by AgentName
            const filteredData = dataRows.filter(row => row.Agent === AgentName);
            console.log(`🔎 Found ${filteredData.length} rows for Agent: ${AgentName}`);

            const formattedDate = `${String(latestFile.date.getMonth() + 1).padStart(2, '0')}/${String(latestFile.date.getDate()).padStart(2, '0')}/${latestFile.date.getFullYear()}`;

            console.log('✅ Returning filtered data to client.\n');

            return res.status(200).json({
                success: true,
                data: filteredData,
                sheet,
                endorsementStatus,
                latestOldEndorsementDate: formattedDate
            });

        } catch (error) {
            console.error('🔥 Error in HardphoneData controller:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while reading endorsement sheets.'
            });
        }
    },
    UpdateHardPhoneData: async (req, res) => {

        if (!UsersController._fileCache) UsersController._fileCache = {};
        if (!UsersController._workbookCache) UsersController._workbookCache = {};
        if (!UsersController._rowIndexCache) UsersController._rowIndexCache = {};
        if (!UsersController._pendingSaves) UsersController._pendingSaves = {};

        try {
            const { Hardphone, AgentName, column, value, originalRow } = req.body;

            if (!Hardphone || !AgentName || !column || value === undefined || !originalRow) {
                return res.status(400).json({ success: false, message: "Missing parameters" });
            }

            // 🔹 Hardphone map
            const hardphoneMap = {
                "MEC HARDPHONE 1 - 30": { sheet: "1-30 HARDPHONE", dir: "MEC" },
                "MEC HARDPHONE 61 AND UP": { sheet: "61 HARDPHONE", dir: "MEC" },
                "MEC HARDPHONE 121 AND UP": { sheet: "121 HARDPHONE", dir: "MEC" },
                "MPL HARDPHONE 1 - 30": { sheet: "1-30 HARDPHONE", dir: "MPL" },
                "MPL HARDPHONE 91 AND UP": { sheet: "91 ", dir: "MPL" },
            };

            const info = hardphoneMap[Hardphone];
            if (!info) {
                return res.status(400).json({ success: false, message: "Invalid Hardphone value" });
            }

            // ---------------- 1. Resolve latest file ----------------
            const basePath = path.resolve(__dirname, `../../endorsement/${info.dir}`);
            const now = Date.now();
            let filePath;

            if (
                UsersController._fileCache[Hardphone] &&
                now - UsersController._fileCache[Hardphone].time < 60000
            ) {
                filePath = UsersController._fileCache[Hardphone].file;
            } else {
                const allDirs = ["NEW", "OLD"].map((d) => path.join(basePath, d));
                let latestFile = null;

                for (const folder of allDirs) {
                    if (!fs.existsSync(folder)) continue;
                    const files = fs.readdirSync(folder).filter((f) => f.endsWith(".xlsx") && !f.startsWith("~$"));

                    for (const file of files) {
                        const match = file.match(/(\d{8})/);
                        if (!match) continue;

                        const date = new Date(
                            Number(match[1].slice(4)), // year
                            Number(match[1].slice(0, 2)) - 1, // month
                            Number(match[1].slice(2, 4)) // day
                        );

                        if (!latestFile || date > latestFile.date) {
                            latestFile = { file, dir: folder, date };
                        }
                    }
                }

                if (!latestFile) {
                    return res.status(404).json({ success: false, message: "No Excel file found" });
                }

                filePath = path.join(latestFile.dir, latestFile.file);
                UsersController._fileCache[Hardphone] = { time: now, file: filePath };
            }

            // ---------------- 2. Load workbook ----------------
            let workbook;
            if (UsersController._workbookCache[filePath]) {
                workbook = UsersController._workbookCache[filePath];
            } else {
                workbook = new ExcelJS.Workbook();
                await workbook.xlsx.readFile(filePath);
                UsersController._workbookCache[filePath] = workbook;
            }

            const worksheet = workbook.getWorksheet(info.sheet);
            if (!worksheet) {
                return res.status(400).json({ success: false, message: `Sheet "${info.sheet}" not found.` });
            }

            // ---------------- 3. Headers ----------------
            const headers = {};
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                headers[cell.value?.toString().trim()] = colNumber;
            });

            const colIndex = headers[column];
            if (!colIndex) {
                return res.status(400).json({ success: false, message: `Invalid column: ${column}` });
            }

            // ---------------- 4. Row index ----------------
            const cacheKey = `${filePath}:${info.sheet}`;
            if (!UsersController._rowIndexCache[cacheKey]) {
                const index = {};
                worksheet.eachRow((row, rowNum) => {
                    if (rowNum === 1) return;
                    const agent = row.getCell(headers["Agent"]).text?.trim();
                    if (agent) index[agent] = rowNum;
                });
                UsersController._rowIndexCache[cacheKey] = index;
            }

            const rowIndexMap = UsersController._rowIndexCache[cacheKey];
            const rowIndex = rowIndexMap[originalRow["Agent"]];
            if (!rowIndex) {
                return res.status(404).json({ success: false, message: "Matching row not found." });
            }

            // ---------------- 5. Update in memory ----------------
            const row = worksheet.getRow(rowIndex);
            row.getCell(colIndex).value = value;
            row.commit();

            // ---------------- 6. Safe lazy save ----------------
            if (!UsersController._pendingSaves[cacheKey]) {
                UsersController._pendingSaves[cacheKey] = { workbook, timer: null, writingPromise: Promise.resolve() };
            }
            const pending = UsersController._pendingSaves[cacheKey];

            if (pending.timer) clearTimeout(pending.timer);
            pending.timer = setTimeout(() => {
                // queue the save so it never overlaps
                pending.writingPromise = pending.writingPromise.then(async () => {
                    console.log(`💾 Flushing workbook for ${cacheKey}...`);
                    await workbook.xlsx.writeFile(filePath);
                    console.log(`✅ Flushed ${cacheKey}`);
                }).catch(err => {
                    console.error("🔥 Error flushing workbook:", err);
                });
            }, 2000);

            return res.json({ success: true, message: "Cell updated (pending save)." });

        } catch (err) {
            console.error("🔥 Error in updateCell:", err);
            return res.status(500).json({ success: false, message: "Server error." });
        }
    }
};

module.exports = UsersController;