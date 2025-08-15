const EmailRequestModel = require('../../models/agent/EmailRequestModel');

async function AgentEmailRequestValidation(req, res, next) {
    const {
        AgentId, agentName, Campaign, Reqemail, Reqclient, Reqmobile, Reqamount, Reqaccount, Reqdetails
    } = req.body;

    if (!Reqemail || !Reqclient || !Reqmobile || !Reqamount || !Reqaccount || !Reqdetails) {
        return res.status(200).json({
            success: false,
            message: 'All fields are required!'
        });
    }

    try {
        const existingRequests = await EmailRequestModel.CheckExistingEmail(Reqemail);

        if (existingRequests && existingRequests.length > 0) {
            return res.status(200).json({
                success: false,
                message: `The email ${Reqemail} is already Requested by ${existingRequests[0].agentName}.`
            });
        }

        return next();
    } catch (error) {
        console.error('Validation error:', error);
        return res.status(400).json({
            success: false,
            message: 'Server error during Check email validation.'
        });
    }
}

module.exports = { AgentEmailRequestValidation };
