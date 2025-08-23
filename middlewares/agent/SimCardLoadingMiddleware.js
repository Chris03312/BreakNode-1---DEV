const SimCardLoadingModel = require('../../models/agent/SimCardLoadingModel');

async function AgentLoadRequest(req, res, next) {
    const { AgentId, AgentName, Campaign, reqloadmobile, reqloadpurpose } = req.body;

    if (!reqloadmobile || !reqloadpurpose) {
        return res.status(200).json({
            success: false,
            message: 'All fields are required'
        });
    }
    try {
        const checkexitingnumber = await SimCardLoadingModel.checkExistingNumber(reqloadmobile);
        if (checkexitingnumber.length > 0) {
            return res.status(200).json({
                success: false,
                message: "A load request for this number already exists."
            });
        }

        return next();
    } catch (error) {
        console.error('Validation error:', error);
        return res.status(400).json({
            success: false,
            message: 'Server error during Check load validation.'
        });
    }
}

module.exports = { AgentLoadRequest };