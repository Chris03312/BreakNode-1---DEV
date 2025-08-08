const AuthenticationModel = require('../../models/break/AuthenticationModel');

async function LoginValidation(req, res, next) {
    const { UserId, Password } = req.body;

    const missing = [];

    if (!UserId) missing.push("User ID");
    if (!Password) missing.push("Password");

    if (missing.length > 0) {
        return res.status(401).json({
            success: false,
            message: `${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} required.`
        });
    }

    try {
        const admin = await AuthenticationModel.AccessAdminUser(UserId);

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

        req.user = admin[0]; // Optional: attach to request
        return next();
    } catch (error) {
        console.error('[LoginValidation ERROR]', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during Admin authentication.'
        });
    }
}

module.exports = { LoginValidation };
