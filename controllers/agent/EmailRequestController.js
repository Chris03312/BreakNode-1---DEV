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

            const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

            const confirmedEmailRequest = EmailRequestData.filter(
                user => user.remarks.startsWith('Confirmed')
            );

            const brokenRequest = EmailRequestData.filter(user =>
                !user.remarks.startsWith('Pending') &&
                (
                    (user.remarks.startsWith('Broken') && user.request.startsWith('Proof of Payment')) ||
                    user.request.startsWith('Viber Request')
                )
            );

            const pendingEmailRequest = EmailRequestData.filter(user =>
                user.email !== 'Non-Email' &&
                user.date === today &&
                (user.remarks === "Pending" || user.remarks === "Sent")
            );

            const viberRequest = EmailRequestData.filter(
                user => user.request.startsWith('Viber Request') && user.date === today
            );

            return res.status(200).json({
                success: true,
                pending: pendingEmailRequest,
                viber: viberRequest,
                confirmed: confirmedEmailRequest,
                broken: brokenRequest,
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
        const { AgentId, agentName, Campaign, Reqemail, Reqclient, Reqmobile, Reqamount, Reqaccount, Reqdetails, reqdpd } = req.body;

        try {
            const AgentEmailRequest = await EmailRequestModel.InsertEmailRequest(AgentId, agentName, Campaign, Reqemail, Reqclient, Reqmobile, Reqamount, Reqaccount, Reqdetails, reqdpd);
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

    InsertAgentViberRequest: async (req, res) => {
        const { AgentId, agentName, Campaign, vibclient, vibmobile, vibamount, vibaccount, vibdetails, vibdpd } = req.body;

        console.log(AgentId, agentName, Campaign, vibclient, vibmobile, vibamount, vibaccount, vibdetails, vibdpd);

        try {
            const AgentViberRequest = await EmailRequestModel.InsertViberRequest(AgentId, agentName, Campaign, vibclient, vibmobile, vibamount, vibaccount, vibdetails, vibdpd);
            if (!AgentViberRequest || AgentViberRequest.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'Failed to insert Email Request'
                });
            }

            return res.status(200).json({
                success: true,
                message: `Successfully requested an email for ${vibclient}`
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
    },
    ReEmailRequest: async (req, res) => {
        const { AgentId, Campaign, ClientName, Email, Amount, Dpd, AccountNumber } = req.body;

        try {
            const ReEmailRequests = await EmailRequestModel.AgentReEmailRequest(
                AgentId, Campaign, Email, Amount, Dpd, AccountNumber
            );

            const isNonEmail = Email === 'Non-Email';

            if (!ReEmailRequests && ReEmailRequests.length > 0) {
                return res.status(200).json({
                    success: false,
                    message: isNonEmail
                        ? `Re - Requesting ${ClientName} failed`
                        : `Re - Emailing ${Email} failed`
                });
            }

            return res.status(200).json({
                success: true,
                message: isNonEmail
                    ? `Re - Requesting ${ClientName} was successful`
                    : `Re - Emailing ${Email} was successful`
            });

        } catch (error) {
            console.warn(error);
            return res.status(400).json({
                success: false,
                message: 'Error in Re Request Email',
                error
            });
        }
    },

    CountEmailRequest: async (req, res) => {
        const { AgentId, Campaign } = req.body;
        const today = new Date().toISOString().split('T')[0];
        try {
            const results = await EmailRequestModel.CountEmailRequests(AgentId, Campaign, today);

            if (!results || results.length === 0) {
                return res.status(200).json({
                    success: true,
                    total: 0,
                    confirmed: 0,
                });
            }

            const { total, confirmed } = results[0];

            return res.status(200).json({
                success: true,
                total,
                confirmed,
            });
        } catch (error) {
            console.warn(error);
            return res.status(400).json({
                success: false,
                message: 'Error in Counting Request Email',
                error
            });
        }
    }
}

module.exports = EmaiRequestController;