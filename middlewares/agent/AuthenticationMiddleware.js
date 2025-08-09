const AuthenticationModel = require('../../models/agent/AuthenticationModel');

async function AgentLoginValidation(req, res, next) {
    const { UserId, Password } = req.body;

    try {
        const agent = await AuthenticationModel.AccessAgentData(UserId);

        if (!agent || agent.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'No user found!'
            });
        }

        if (Password !== agent[0].password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid User ID or Password.'
            });
        }

        req.user = agent[0];
        return next();
    } catch (error) {
        console.error('[LoginValidation ERROR]', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during Admin authentication.'
        });
    }
}

module.exports = { AgentLoginValidation };
