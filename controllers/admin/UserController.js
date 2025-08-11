const UsersModel = require('../../models/admin/UserModel');

const UsersController = {
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

            return res.status(200).json({
                success: true,
                mec: mecUsers,
                mpl: mplUsers,
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
    }
}

module.exports = UsersController;