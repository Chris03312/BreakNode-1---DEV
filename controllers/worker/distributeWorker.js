const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

process.on("message", async ({ type, name }) => {
    try {
        const dateMatch = name.match(/(\d{2})(\d{2})(\d{4})/);
        const dateFolder = dateMatch ? `${dateMatch[3]}${dateMatch[1]}${dateMatch[2]}` :
            new Date().toISOString().slice(0, 10).replace(/-/g, "");

        const targetDir = path.join(__dirname, "../../endorsement", type, dateFolder);
        const usersCsvPath = path.join(targetDir, "USERS.csv");
        const campaignFile = "1-30 HARDPHONE.csv";
        const campaignFilePath = path.join(targetDir, campaignFile);

        if (!fs.existsSync(usersCsvPath)) throw new Error(`❌ USERS.csv not found in ${targetDir}`);
        if (!fs.existsSync(campaignFilePath)) throw new Error(`❌ ${campaignFile} not found in ${targetDir}`);

        const usersRaw = fs.readFileSync(usersCsvPath, "utf8");
        const usersParsed = Papa.parse(usersRaw, { header: true }).data;
        const agents = usersParsed
            .filter(row => row.CAMPAIGN && row.CAMPAIGN.includes("1 - 30"))
            .map(row => row.AGENT_NAME)
            .filter(Boolean);

        if (agents.length === 0) throw new Error("❌ No agents found for '1 - 30' campaign");

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

        // 🛠 Ensure "Agent" key exists in all rows
        data.forEach(row => {
            if (!Object.prototype.hasOwnProperty.call(row, "Agent")) {
                row["Agent"] = "";
            }
        });

        const updatedCsv = Papa.unparse(data, { header: true });
        fs.writeFileSync(campaignFilePath, updatedCsv, "utf8");

        process.send({ success: true, message: `✅ Agent distribution complete: ${campaignFilePath}` });
        process.exit(0);

    } catch (err) {
        console.error("❌ Worker Error:", err);
        process.send({ success: false, message: err.message });
        process.exit(1);
    }
});
