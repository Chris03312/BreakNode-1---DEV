const EmailRequestModel = require('../../models/agent/EmailRequestModel');

const EmaiRequestController = {
    GetEmailRequestData: async (req, res) => {
        const { AgentId, Campaign } = req.body;
        try {
            const EmailRequestData = await EmailRequestModel.EmailRequestData(AgentId, Campaign);

            if (!EmailRequestData || EmailRequestData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No Available Users Data',
                    emails: []
                });
            }

            const confirmedEmailRequest = EmailRequestData.filter(user => user.remarks.startsWith('Confirmed'));
            const pendingEmailRequest = EmailRequestData.filter(user => !user.request.startsWith('Viber Request') && !user.remarks.startsWith('Confirmed') && user.request.startsWith('Proof of Payment') || user.remarks.startsWith('Sent'));
            const viberRequest = EmailRequestData.filter(user => user.request.startsWith('Viber Request'));

            return res.status(200).json({
                success: true,
                pending: pendingEmailRequest,
                viber: viberRequest,
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
    },

    AgentEmailEditDatas: async (req, res) => {
        const { AgentId, AccountNumber, request } = req.body;

        if (request === 'Proof of Payment') {
            try {
                const AgentEmailRequestData = await EmailRequestModel.EmailEditRequestData(AgentId, AccountNumber, request);
                if (!AgentEmailRequestData || AgentEmailRequestData.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: `No data for ${AccountNumber}`
                    });
                }

                return res.json({
                    success: true,
                    data: AgentEmailRequestData[0]
                });
            } catch (error) {
                console.warn(error);
                return res.status(400).json({
                    success: false,
                    message: 'Error in Inserting Email Request',
                    error
                });
            }
        } else if (request === 'Viber Request') {
            try {
                const AgentEmailRequestData = await EmailRequestModel.EmailEditRequestData(AgentId, AccountNumber, request);

                if (!AgentEmailRequestData || AgentEmailRequestData.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: `No data for ${AccountNumber}`
                    });
                }

                return res.json({
                    success: true,
                    data: AgentEmailRequestData[0]
                });
            } catch (error) {
                console.warn(error);
                return res.status(400).json({
                    success: false,
                    message: 'Error in Inserting Email Request',
                    error
                });
            }
        }
    },

    AgentEmailUpdateDatas: async (req, res) => {
        const { AgentId, Campaign, reqeditemail, reqeditclient, reqeditmobile, reqeditamount, reqeditaccount, reqeditdetails } = req.body;

        try {
            const AgentEmailUpdateData = await EmailRequestModel.AgentEmailUpdateDatas(AgentId, Campaign, reqeditemail, reqeditclient, reqeditmobile, reqeditamount, reqeditaccount, reqeditdetails);
            if (!AgentEmailUpdateData || AgentEmailUpdateData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: `No Email Found ${reqeditemail}`
                });
            }

            return res.json({
                success: true,
                message: 'Email Request Updated Successfully'
            });
        } catch (error) {
            console.warn(error);
            return res.status(400).json({
                success: false,
                message: 'Error in Inserting Email Request',
                error
            });
        }
    }
}

module.exports = EmaiRequestController;