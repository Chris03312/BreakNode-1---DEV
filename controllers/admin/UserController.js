const UsersModel = require('../../models/admin/UsersModel');

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
}

module.exports = UsersController;