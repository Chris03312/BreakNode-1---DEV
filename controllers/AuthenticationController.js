const AuthenticationController = {
    Login: (req, res) => {
        const user = req.user; // Assigned by middleware

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        return res.json({
            success: true,
            message: 'Login Successful',
            redirect: '/dashboard'
        });
    },

    Logout: (req, res) => {
        res.json({
            redirect: 'login.php'
        });
    }
};

module.exports = AuthenticationController;
