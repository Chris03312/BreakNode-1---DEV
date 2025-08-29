const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

process.on("message", async ({ type, name }) => {
    try {
        const dateMatch = name.match(/(\d{2})(\d{2})(\d{4})/);
        const dateFolder = dateMatch
            ? `${dateMatch[3]}${dateMatch[1]}${dateMatch[2]}`
            : new Date().toISOString().slice(0, 10).replace(/-/g, "");

        const baseDir = path.join(__dirname, "../../endorsement");

        // Define campaign mapping for MEC and MPL
        const campaignConfig = {
            MEC: {
                "MEC 1 - 30": "1-30 HARDPHONE.csv",
                "MEC 61 AND UP": "61 HARDPHONE.csv",
                "MEC 121 AND UP": "121 HARDPHONE.csv"
            },
            MPL: {
                "MPL 1 - 30": "1-30 HARDPHONE.csv",
                "MPL 91 AND UP": "91 HARDPHONE.csv"
            }
        };

        for (const [dirKey, campaigns] of Object.entries(campaignConfig)) {
            const targetDir = path.join(baseDir, dirKey, dateFolder);
            const usersCsvPath = path.join(targetDir, "USERS.csv");

            if (!fs.existsSync(usersCsvPath)) {
                console.warn(`⚠️ USERS.csv not found in ${targetDir}`);
                continue;
            }

            const usersRaw = fs.readFileSync(usersCsvPath, "utf8");
            const usersParsed = Papa.parse(usersRaw, { header: true }).data;

            for (const [campaignName, csvFileName] of Object.entries(campaigns)) {
                const agents = usersParsed
                    .filter(row => row.CAMPAIGN && row.CAMPAIGN.trim() === campaignName)
                    .map(row => row.AGENT_NAME)
                    .filter(Boolean);

                if (agents.length === 0) {
                    console.log(`⚠️ No agents found for campaign: ${campaignName}`);
                    continue;
                }

                const campaignFilePath = path.join(targetDir, csvFileName);
                if (!fs.existsSync(campaignFilePath)) {
                    console.warn(`⚠️ ${csvFileName} not found in ${targetDir}`);
                    continue;
                }

                const hardphoneRaw = fs.readFileSync(campaignFilePath, "utf8");
                const hardphoneParsed = Papa.parse(hardphoneRaw, { header: true });
                const data = hardphoneParsed.data;

                const totalRows = data.length;
                const rowsPerAgent = Math.floor(totalRows / agents.length);
                let remainder = totalRows % agents.length;
                let index = 0;

                for (const agent of agents) {
                    const count = rowsPerAgent + (remainder > 0 ? 1 : 0);
                    for (let i = 0; i < count && index < totalRows; i++) {
                        data[index]["Agent"] = agent;
                        index++;
                    }
                    if (remainder > 0) remainder--;
                }

                data.forEach(row => {
                    if (!Object.prototype.hasOwnProperty.call(row, "Agent")) {
                        row["Agent"] = "";
                    }
                });

                const updatedCsv = Papa.unparse(data, { header: true });
                fs.writeFileSync(campaignFilePath, updatedCsv, "utf8");

                console.log(`✅ Agent distribution complete for: ${dirKey}/${csvFileName}`);
            }
        }

        process.send({ success: true, message: "✅ Agent distribution completed across all campaigns." });
        process.exit(0);

    } catch (err) {
        console.error("❌ Worker Error:", err);
        process.send({ success: false, message: err.message });
        process.exit(1);
    }
});
