const fs = require('fs');
const path = require('path');
const csvParser = require("csv-parser");
const Papa = require("papaparse");

const UsersController = {
    EndorsementData: async (req, res) => {
        try {
            const { Campaign } = req.body;

            if (!Campaign) {
                return res.status(400).json({ success: false, message: 'Campaign is required.' });
            }

            const campaignMap = {
                'MEC 1 - 30': { sheet: '1-30 DPD', dir: 'MEC' },
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

            const formatDate = (date) => {
                return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
            };

            const today = new Date();
            let folderDate = formatDate(today);

            const baseFolderPath = path.resolve(__dirname, `../../endorsement/${dir}`);
            let folderPath = path.join(baseFolderPath, folderDate);

            if (!fs.existsSync(folderPath)) {
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                folderDate = formatDate(yesterday);
                folderPath = path.join(baseFolderPath, folderDate);
                console.log(`⚠️ Today's folder not found. Using yesterday's folder: ${folderDate}`);
            } else {
                console.log(`📂 Using today's folder: ${folderDate}`);
            }

            if (!fs.existsSync(folderPath)) {
                return res.status(200).json({ success: true, data: [], message: 'No folder found for today or yesterday.' });
            }

            const csvFileName = `${sheet}.csv`;
            const csvFilePath = path.join(folderPath, csvFileName);

            if (!fs.existsSync(csvFilePath)) {
                return res.status(200).json({ success: true, data: [], message: `CSV file not found: ${csvFileName}` });
            }

            const allData = [];
            fs.createReadStream(csvFilePath)
                .pipe(csvParser())
                .on('data', (row) => allData.push(row))
                .on('end', () => {
                    return res.status(200).json({
                        success: true,
                        data: allData,
                        sheet,
                        endorsementStatus: `Endorsement for ${folderDate}`,
                        folderDate
                    });
                })
                .on('error', (err) => {
                    console.error(`❌ Error reading CSV file: ${csvFilePath}`, err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error reading CSV file.'
                    });
                });

        } catch (error) {
            console.error('🔥 Server error while reading endorsement data:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while reading endorsement data.'
            });
        }
    },
    HardphoneData: async (req, res) => {
        try {
            const { Hardphone, AgentName } = req.body;
            console.log("📥 Incoming request /hardphoneData:", { Hardphone, AgentName });

            if (!Hardphone || !AgentName) {
                return res.status(400).json({ success: false, message: "Hardphone and AgentName are required." });
            }

            const hardphoneMap = {
                "MEC HARDPHONE 1 - 30": { sheet: "1-30 HARDPHONE", dir: "MEC" },
                "MEC HARDPHONE 61 AND UP": { sheet: "61 HARDPHONE", dir: "MEC" },
                "MEC HARDPHONE 121 AND UP": { sheet: "121 HARDPHONE", dir: "MEC" },
                "MPL HARDPHONE 1 - 30": { sheet: "1-30 HARDPHONE", dir: "MPL" },
                "MPL HARDPHONE 91 AND UP": { sheet: "91 HARDPHONE", dir: "MPL" }
            };

            const info = hardphoneMap[Hardphone];
            if (!info) {
                return res.status(400).json({ success: false, message: "Invalid Hardphone value." });
            }

            const formatDate = (date) =>
                `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;

            const today = new Date();
            let folderDate = formatDate(today);

            const baseFolder = path.resolve(__dirname, `../../endorsement/${info.dir}`);
            let folderPath = path.join(baseFolder, folderDate);

            // fallback to yesterday if today doesn't exist
            if (!fs.existsSync(folderPath)) {
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                folderDate = formatDate(yesterday);
                folderPath = path.join(baseFolder, folderDate);
                console.log(`⚠️ Today's folder not found. Using yesterday's folder: ${folderDate}`);
            } else {
                console.log(`📂 Using today's folder: ${folderDate}`);
            }

            if (!fs.existsSync(folderPath)) {
                return res.status(200).json({ success: true, data: [], message: "No folder found for today or yesterday." });
            }

            const csvFileName = `${info.sheet}.csv`;
            const csvFilePath = path.join(folderPath, csvFileName);

            if (!fs.existsSync(csvFilePath)) {
                return res.status(200).json({ success: true, data: [], message: `CSV file not found: ${csvFileName}` });
            }

            console.log(`✅ Using CSV file: ${csvFilePath}`);

            const csvData = fs.readFileSync(csvFilePath, "utf8");
            const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });

            const filteredData = parsed.data.filter(row =>
                row.Agent && row.Agent.trim().toLowerCase() === AgentName.trim().toLowerCase()
            );

            const formattedDate = `${String(folderDate.slice(4, 6))}/${String(folderDate.slice(6, 8))}/${folderDate.slice(0, 4)}`;

            return res.status(200).json({
                success: true,
                data: filteredData,
                sheet: info.sheet,
                endorsementStatus: `Endorsement for ${folderDate}`,
                latestOldEndorsementDate: formattedDate
            });

        } catch (err) {
            console.error("🔥 Error in HardphoneData:", err);
            return res.status(500).json({ success: false, message: "Server error while reading endorsement CSV." });
        }
    },
    UpdateHardPhoneData: async (req, res) => {
        try {
            const { Hardphone, AgentName, column, value, originalRow } = req.body;

            if (!Hardphone || !AgentName || !column || value === undefined || !originalRow) {
                return res.status(400).json({ success: false, message: "Missing parameters" });
            }

            const hardphoneMap = {
                "MEC HARDPHONE 1 - 30": { sheet: "1-30 HARDPHONE", dir: "MEC" },
                "MEC HARDPHONE 61 AND UP": { sheet: "61 HARDPHONE", dir: "MEC" },
                "MEC HARDPHONE 121 AND UP": { sheet: "121 HARDPHONE", dir: "MEC" },
                "MPL HARDPHONE 1 - 30": { sheet: "1-30 HARDPHONE", dir: "MPL" },
                "MPL HARDPHONE 91 AND UP": { sheet: "91 HARDPHONE", dir: "MPL" }
            };

            const info = hardphoneMap[Hardphone];
            if (!info) return res.status(400).json({ success: false, message: "Invalid Hardphone value" });

            const formatDate = (date) =>
                `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;

            const today = new Date();
            let folderDate = formatDate(today);

            const baseFolder = path.resolve(__dirname, `../../endorsement/${info.dir}`);
            let folderPath = path.join(baseFolder, folderDate);

            if (!fs.existsSync(folderPath)) {
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                folderDate = formatDate(yesterday);
                folderPath = path.join(baseFolder, folderDate);
                console.log(`⚠️ Today's folder not found. Using yesterday's folder: ${folderDate}`);
            } else {
                console.log(`📂 Using today's folder: ${folderDate}`);
            }

            if (!fs.existsSync(folderPath)) {
                return res.status(404).json({ success: false, message: "No folder found for today or yesterday." });
            }

            const csvFileName = `${info.sheet}.csv`;
            const csvFilePath = path.join(folderPath, csvFileName);

            if (!fs.existsSync(csvFilePath)) {
                return res.status(404).json({ success: false, message: `CSV file not found: ${csvFileName}` });
            }

            console.log(`✅ Using CSV file: ${csvFilePath}`);

            const csvData = fs.readFileSync(csvFilePath, "utf8");
            const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });

            const row = parsed.data.find(r =>
                r.ACCOUNT_NUMBER?.toString().trim() === originalRow.ACCOUNT_NUMBER?.toString().trim()
            );

            if (!row) {
                return res.status(404).json({ success: false, message: "Row not found for this ACCOUNT_NUMBER." });
            }

            row[column] = value;
            const newCsv = Papa.unparse(parsed.data);
            fs.writeFileSync(csvFilePath, newCsv, "utf8");

            console.log(`✅ Updated ${column} for ACCOUNT_NUMBER ${originalRow.ACCOUNT_NUMBER} in ${csvFilePath}`);

            return res.json({ success: true, message: "CSV updated successfully.", folderDate });

        } catch (err) {
            console.error("🔥 Error in UpdateHardPhoneData:", err);
            return res.status(500).json({ success: false, message: "Server error while updating CSV." });
        }
    }
};

module.exports = UsersController;