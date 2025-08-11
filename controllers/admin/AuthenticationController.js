const AuthenticationModel = require('../../models/admin/AuthenticationModel');

const AuthenticationController = {
    AdminLogin: (req, res) => {
        const admin = req.admin;
        const Name = req.admin.name;
        const UserId = req.admin.id;


        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        try {
            const InsertLoginLog = AuthenticationModel.LoginLogs(UserId, Name);

            if (!InsertLoginLog || InsertLoginLog.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'Failed to insert Login Logs',
                });
            }

        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Agent Login.'
            });
        }

        return res.json({
            success: true,
            redirect: '/admin/dashboard',
            UserId,
            Name
        });
    },

    Logout: (req, res) => {
        res.json({
            redirect: 'login.php'
        });
    }
};

module.exports = AuthenticationController;
