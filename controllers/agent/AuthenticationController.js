const AuthenticationController = {
    AgentLogin: (req, res) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        return res.json({
            success: true,
            message: 'Login Successful',
            redirect: '/agent/dashboard',
            data: user
        });
    },

    Logout: (req, res) => {
        res.json({
            redirect: 'login.php'
        });
    }
};

module.exports = AuthenticationController;
