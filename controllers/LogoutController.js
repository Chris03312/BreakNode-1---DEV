const LogoutController = {
    Logout: (req, res) => {
        const { UserId } = req.body;
        if (UserId) {
            return res.status(200).json({
                success: true,
                redirect: '/',
            });
        } else {
            return res.status(401).json({
                success: false,
            });
        }
    },
};

module.exports = LogoutController;
