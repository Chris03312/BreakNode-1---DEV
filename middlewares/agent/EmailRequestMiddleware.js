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
            const { agentName, remarks } = existingRequests[0];

            return res.status(200).json({
                success: false,
                message: `The email ${Reqemail} is requested by ${agentName} (status: ${remarks}).`
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


async function AgentViberRequestValidation(req, res, next) {
    const {
        AgentId, agentName, Campaign, Reqclient, Reqmobile, Reqamount, Reqaccount, Reqdetails
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
            const { agentName, remarks } = existingRequests[0];

            return res.status(200).json({
                success: false,
                message: `The email ${Reqemail} is requested by ${agentName} (status: ${remarks}).`
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

async function AgentReEmailRequest(req, res, next) {
    const { AgentId, Campaign, Email, Amount, Dpd, AccountNumber } = req.body;

    console.log({ AgentId, Campaign, Email, Amount, Dpd, AccountNumber });

    if (!Amount || !Dpd) {
        return res.status(200).json({
            success: false,
            message: 'All Fields Are Required'
        });
    }
    return next();
}

async function AgentLoadRequest(req, res, next) {
    const { AgentId, AgentName, Campaign, reqloadmobile, reqloadpurpose } = req.body;

    if (!reqloadmobile || !reqloadpurpose) {
        return res.status(200).json({
            success: false,
            message: 'All fields are required'
        });
    }
    try {
        const checkexitingnumber = await EmailRequestModel.checkExistingNumber(AgentId, AgentName, Campaign, reqloadmobile);
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




module.exports = { AgentEmailRequestValidation, AgentReEmailRequest, AgentLoadRequest };
