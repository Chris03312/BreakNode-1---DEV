const AuthenticationController = {
    AdminLogin: (req, res) => {
        const admin = req.admin;

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        return res.json({
            success: true,
            message: 'Login Successful',
            redirect: '/admin/dashboard',
            data: admin
        });
    },

    Logout: (req, res) => {
        res.json({
            redirect: 'login.php'
        });
    }
};

module.exports = AuthenticationController;
