const UsersModel = require('../../models/break/UsersModel');

const UsersController = {
    UsersData: async (req, res) => {
        try {
            const data = await UsersModel.UsersData();

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

    InsertUser: async (req, res) => {
        const { UserId, Name, Campaign, Password, FffBreak,
            FftBreak, FoneHour, ToneHour, SffBreak, SftBreak } = req.body;

        console.log('Controller: ', UserId, Name, Campaign, Password, FffBreak,
            FftBreak, FoneHour, ToneHour, SffBreak, SftBreak);

        try {
            const insert = await UsersModel.InsertData(UserId, Name, Campaign, Password, FffBreak,
                FftBreak, ToneHour, FoneHour, SffBreak, SftBreak);

            if (insert && insert.changes > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'User Inserted Successfully'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Inserting User Datas.'
            });
        }
    },

    EditUsers: async (req, res) => {
        const { id } = req.body;

        try {
            const editInfo = await UsersModel.EditData(id);

            if (editInfo && editInfo.length > 0) {
                return res.status(200).json({
                    success: true,
                    data: editInfo
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

    SearchUsers: async (req, res) => {
        const searchTerm = req.query.search || '';

        try {
            const search = await UsersModel.SearchData(searchTerm);

            if (search && search.length > 0) {
                return res.status(200).json({
                    success: true,
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

    UpdateUsers: async (req, res) => {
        const { UserId, Name, Campaign, Password } = req.body;

        console.log('Controller', UserId, Name, Campaign, Password)

        try {
            const update = await UsersModel.UpdateUser(UserId, Name, Campaign, Password);

            if (update && update.changes > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Successfully Updated the User Data'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Failed to Update the data for "${UserId}"`
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Updating User Datas.'
            });
        }
    },

    UpdateUsersSchedule: async (req, res) => {
        const { UserId, FffBreak, FftBreak, FoneHour, ToneHour, SffBreak, SftBreak } = req.body;

        try {
            const schedule = await UsersModel.UpdateSchedule(UserId, FffBreak, FftBreak, FoneHour, ToneHour, SffBreak, SftBreak);

            if (schedule && schedule.changes > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Successfully Updated the User Schedule'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Failed to Update the schedule for "${UserId}"`
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Updating User Schedules.'
            });
        }
    },

    DeleteUsers: async (req, res) => {
        const { UserId } = req.body;

        try {
            const deleteUser = await UsersModel.DeleteUser(UserId);

            if (deleteUser && deleteUser.changes > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Successfully Deleted the User Information'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Failed to Delete the Information for "${UserId}"`
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Deleting User Information.'
            });
        }
    }
}

module.exports = UsersController;