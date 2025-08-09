const AuthenticationModel = require('../../models/admin/AuthenticationModel');

async function AdminLoginValidation(req, res, next) {
    const { UserId, Password } = req.body;

    try {
        const admin = await AuthenticationModel.AccessAdminData(UserId);

        if (!admin || admin.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'No user found!'
            });
        }

        if (Password !== admin[0].password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid User ID or Password.'
            });
        }

        req.admin = admin[0]; // Optional: attach to request
        return next();
    } catch (error) {
        console.error('[LoginValidation ERROR]', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during Admin authentication.'
        });
    }
}

module.exports = { AdminLoginValidation };
