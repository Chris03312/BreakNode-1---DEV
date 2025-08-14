const EmailRequestModel = require('../../models/agent/EmailRequestModel');

const EmaiRequestController = {
    GetEmailRequestData: async (req, res) => {
        const { AgentId } = req.body;
        try {
            const EmailRequestData = await EmailRequestModel.EmailRequestData(AgentId);

            if (!EmailRequestData || EmailRequestData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No Available Users Data',
                    emails: []
                });
            }

            const pendingEmailRequest = EmailRequestData.filter(user => user.remarks.startsWith('Pending'));
            const sentEmailRequest = EmailRequestData.filter(user => user.remarks.startsWith('Sent'));
            const confirmedEmailRequest = EmailRequestData.filter(user => user.remarks.startsWith('Confirmed'));

            return res.status(200).json({
                success: true,
                pending: pendingEmailRequest,
                sent: sentEmailRequest,
                confirmed: confirmedEmailRequest,
                emails: EmailRequestData
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during getting email request data.'
            });
        }
    },

    InsertAgentEmailRequest: async (req, res) => {
        const { AgentId, agentName, Campaign, Reqemail, Reqclient, Reqmobile, Reqamount, Reqaccount, Reqdetails } = req.body;

        try {
            const AgentEmailRequest = await EmailRequestModel.InsertEmailRequest(AgentId, agentName, Campaign, Reqemail, Reqclient, Reqmobile, Reqamount, Reqaccount, Reqdetails);
            if (!AgentEmailRequest || AgentEmailRequest.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'Failed to insert Email Request'
                });
            }

            return res.status(200).json({
                success: true,
                message: `Successfully requested an email for ${Reqclient}`
            });
        } catch (error) {
            console.warn(error);
            return res.status(400).json({
                success: false,
                message: 'Error in Inserting Email Request', error
            })
        }
    }
}

module.exports = EmaiRequestController;