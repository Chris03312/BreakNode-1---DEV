const AuthenticationModel = require('../../models/agent/AuthenticationModel');

const AuthenticationController = {
    AgentLogin: (req, res) => {
        const user = req.user;
        const Name = req.user.name;
        const UserId = req.user.id;
        const Campaign = req.user.campaign;


        if (!user) {
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
            redirect: '/agent/dashboard',
            UserId,
            Name,
            Campaign
        });
    }
};

module.exports = AuthenticationController;
