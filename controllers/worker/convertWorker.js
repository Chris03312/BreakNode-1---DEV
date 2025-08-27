const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

process.on("message", async ({ files }) => {
    try {
        for (const { file, type, name } of files) {
            const targetDir = path.join(__dirname, "../../endorsement", type);

            const dateMatch = name.match(/(\d{2})(\d{2})(\d{4})/);
            let dateFolder;
            if (dateMatch) {
                const [_, mm, dd, yyyy] = dateMatch;
                dateFolder = `${yyyy}${mm}${dd}`;
            } else {
                dateFolder = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            }

            const datedFolder = path.join(targetDir, dateFolder);
            fs.mkdirSync(datedFolder, { recursive: true });
            console.log(`📂 Using folder: ${datedFolder}`);

            let rawTarget = path.join(datedFolder, name);
            let counter = 1;
            while (fs.existsSync(rawTarget)) {
                const baseName = path.parse(name).name;
                const ext = path.parse(name).ext;
                rawTarget = path.join(datedFolder, `${baseName}_${counter}${ext}`);
                counter++;
            }
            fs.copyFileSync(file, rawTarget);
            console.log(`✅ Raw file saved: ${rawTarget}`);

            const workbook = XLSX.readFile(rawTarget);

            workbook.SheetNames.forEach(sheetName => {
                const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                const baseName = path.parse(rawTarget).name;

                let csvPath = path.join(datedFolder, `${sheetName}.csv`);
                counter = 1;
                while (fs.existsSync(csvPath)) {
                    csvPath = path.join(datedFolder, `${baseName}_${sheetName}_${counter}.csv`);
                    counter++;
                }

                fs.writeFileSync(csvPath, csvData, "utf8");
                console.log(`📄 Converted ${sheetName} -> ${csvPath}`);
            });

            console.log(`🎉 Finished processing ${type} -> ${datedFolder}`);
        }

        process.send({ success: true, message: "All files converted successfully" });
        process.exit(0);
    } catch (err) {
        console.error("❌ Worker Error:", err);
        process.send({ success: false, message: err.message });
        process.exit(1);
    }
});
