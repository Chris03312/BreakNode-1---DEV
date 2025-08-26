const fs = require('fs');
const fsPromises = require("fs").promises;
const XLSX = require('xlsx');
const path = require('path');
const { fork } = require("child_process");


const UsersModel = require('../../models/admin/UserModel');

const UsersController = {
    runArchiveEndorsementSync: async () => {
        try {
            const campaignDirs = ['MEC', 'MPL'];

            // Current date in MMDDYYYY format to match filenames
            const today = new Date();
            const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${today.getFullYear()}`;

            for (const dir of campaignDirs) {
                const basePath = path.resolve(__dirname, `../../endorsement/${dir}`);
                const newPath = path.join(basePath, 'NEW');
                const oldPath = path.join(basePath, 'OLD');

                if (!fs.existsSync(newPath)) {
                    console.warn(`⚠️ NEW folder not found for ${dir}`);
                    continue;
                }

                if (!fs.existsSync(oldPath)) {
                    fs.mkdirSync(oldPath, { recursive: true });
                }

                const files = fs.readdirSync(newPath).filter(file =>
                    file.endsWith('.xlsx') && !file.startsWith('~$')
                );

                for (const file of files) {
                    console.log(`🔍 Processing file: ${file}`);

                    const fileDateMatch = file.match(/(\d{8})/);

                    if (!fileDateMatch) {
                        console.warn(`⚠️ No valid date found in file: ${file}`);
                        continue;
                    }

                    const fileDate = fileDateMatch[1];
                    console.log(`📅 File date: ${fileDate}, Today: ${todayStr}`);

                    // If date is not today, archive it
                    if (fileDate !== todayStr) {
                        const fromPath = path.join(newPath, file);
                        const toPath = path.join(oldPath, file);

                        fs.renameSync(fromPath, toPath);
                        console.log(`📦 Moved ${file} ➜ OLD (${dir})`);
                    }
                }
            }

            return {
                success: true,
                message: '✅ Endorsements auto-archived successfully.'
            };

        } catch (error) {
            console.error('🔥 Auto-archiving error:', error);
            return {
                success: false,
                message: '❌ Failed to auto-archive endorsements.',
                error
            };
        }
    },
    AdminInsertEndorsement: async (req, res) => {
        try {
            const mecFile = req.files['endorsementFileMEC'] ? req.files['endorsementFileMEC'][0] : null;
            const mplFile = req.files['endorsementFileMPL'] ? req.files['endorsementFileMPL'][0] : null;

            if (!mecFile && !mplFile) {
                return res.status(400).json({ success: false, message: "No files uploaded." });
            }

            const filesToProcess = [];
            if (mecFile) filesToProcess.push({ file: mecFile.path, type: "MEC", name: mecFile.originalname });
            if (mplFile) filesToProcess.push({ file: mplFile.path, type: "MPL", name: mplFile.originalname });

            const convertWorker = fork(path.join(__dirname, "../worker/convertWorker.js"));

            convertWorker.send({ files: filesToProcess });

            convertWorker.on("message", (msg) => {
                console.log("✅ convertWorker finished:", msg);
            });

            convertWorker.on("exit", (code) => {
                if (code !== 0) {
                    console.error("❌ convertWorker exited with code", code);
                    return;
                }

                // ✅ Once conversion is done, trigger distribution per file
                for (const file of filesToProcess) {
                    const distributeWorker = fork(path.join(__dirname, "../worker/distributeWorker.js"));
                    distributeWorker.send(file); // file = { file, type, name }

                    distributeWorker.on("message", (msg) => {
                        console.log("📦 distributeWorker:", msg);
                    });

                    distributeWorker.on("exit", (exitCode) => {
                        if (exitCode !== 0) {
                            console.error("❌ distributeWorker exited with code", exitCode);
                        }
                    });
                }
            });

            return res.status(200).json({
                success: true,
                message: "✅ Upload successful. Conversion and distribution running in background.",
            });

        } catch (err) {
            console.error("❌ Upload Error:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    AgentsData: async (req, res) => {
        try {
            const data = await UsersModel.AgentsData();

            if (!data || data.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No Available Users Data',
                    users: []
                });
            }

            // Match campaigns like "MEC 1 - 30", "MPL 1 - 30", etc.
            const mecUsers = data.filter(user => user.campaign.startsWith('MEC'));
            const mplUsers = data.filter(user => user.campaign.startsWith('MPL'));
            const qaUsers = data.filter(user => user.campaign.startsWith('QA'));
            const smsUsers = data.filter(user => user.campaign.startsWith('SMS'));

            return res.status(200).json({
                success: true,
                mec: mecUsers,
                mpl: mplUsers,
                qa: qaUsers,
                sms: smsUsers,
                users: data
            });

        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Fetching User Datas.'
            });
        }
    },
    AgentsData: async (req, res) => {
        try {
            const data = await UsersModel.AgentsData();

            if (!data || data.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No Available Users Data',
                    users: []
                });
            }

            // Match campaigns like "MEC 1 - 30", "MPL 1 - 30", etc.
            const mecUsers = data.filter(user => user.campaign.startsWith('MEC'));
            const mplUsers = data.filter(user => user.campaign.startsWith('MPL'));
            const qaUsers = data.filter(user => user.campaign.startsWith('QA'));
            const smsUsers = data.filter(user => user.campaign.startsWith('SMS'));

            return res.status(200).json({
                success: true,
                mec: mecUsers,
                mpl: mplUsers,
                qa: qaUsers,
                sms: smsUsers,
                users: data
            });

        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Fetching User Datas.'
            });
        }
    },
    AgentInsertUser: async (req, res) => {
        const { UserId, Name, Password, Campaign } = req.body;

        console.log("Request body:", req.body);

        try {
            const AgentInsertData = await UsersModel.AgentInsertData(UserId, Name, Password, Campaign);

            console.log("Request body:", AgentInsertData);

            if (!AgentInsertData || AgentInsertData.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: `Failed to Insert New User the information for ${UserId}`
                });
            }

            return res.json({
                success: true,
                message: `Successfully Created new Agent ${UserId}`,
                debug: { UserId, Name, Password, Campaign, AgentInsertData }

            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Inserting New Users.'
            });
        }
    },

    AgentEditData: async (req, res) => {
        const { id } = req.body;

        try {
            const AgentEditDatas = await UsersModel.AgentsEditData(id);

            if (AgentEditDatas && AgentEditDatas.length > 0) {
                return res.status(200).json({
                    success: true,
                    data: AgentEditDatas
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Fetching Edit User Datas.'
            });
        }
    },

    AgentEditUser: async (req, res) => {
        const { UserId, Name, Password, Campaign, Status } = req.body;

        try {
            const AgentUpdateData = await UsersModel.AgentEditUser(UserId, Name, Password, Campaign, Status);

            if (!AgentUpdateData || AgentUpdateData.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: `Failed to Update the information for ${UserId}`
                });
            }

            return res.json({
                success: true,
                message: `Successfully Update the user ${UserId}`
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Updating User Datas.'
            });
        }
    },

    AgentDeleteUser: async (req, res) => {
        const { id } = req.body;

        try {
            const AgentDeleteData = await UsersModel.AgentDeleteUser(id);

            if (!AgentDeleteData || AgentDeleteData.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: `Failed to Delete User data of ${id}`
                });
            }

            return res.json({
                success: true,
                message: `Successfully deleted the User Data of ${id}`
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Deleting User Datas.'
            });
        }
    },

    SearchUser: async (req, res) => {
        const searchTerm = req.query.search || '';
        const users = req.query.users || '';

        try {
            const search = await UsersModel.SearchAgentsData(users, searchTerm);

            const mecUsers = search.filter(user => user.campaign.startsWith('MEC'));
            const mplUsers = search.filter(user => user.campaign.startsWith('MPL'));
            const qaUsers = search.filter(user => user.campaign.startsWith('QA'));
            const smsUsers = search.filter(user => user.campaign.startsWith('SMS'));

            if (search && search.length > 0) {
                return res.status(200).json({
                    success: true,
                    mec: mecUsers,
                    mpl: mplUsers,
                    qa: qaUsers,
                    sms: smsUsers,
                    users: search
                });
            } else {
                return res.status(200).json({
                    success: false,
                    message: `No Searchable Information for "${searchTerm}"`
                });
            }

        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Searching User Datas.'
            });
        }
    },
}

module.exports = UsersController;