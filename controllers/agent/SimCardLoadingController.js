const SimCardLoadingModel = require('../../models/agent/SimCardLoadingModel');

const SimCardLoadingController = {
    LoadRequestDatas: async (req, res) => {
        const { AgentId, Campaign } = req.body;

        try {
            const loadRequests = await SimCardLoadingModel.GetLoadRequests(AgentId, Campaign);

            if (!loadRequests || loadRequests.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No load requests found for this agent and campaign.'
                });
            }

            return res.status(200).json({
                success: true,
                pending: loadRequests // ✅ Match frontend expectation
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Error fetching load request data',
                error
            });
        }
    },
    InsertLoadRequest: async (req, res) => {
        const { AgentId, AgentName, Campaign, reqloadmobile, reqloadpurpose } = req.body;
        const amount = '20';

        console.log({
            AgentId,
            AgentName,
            Campaign,
            reqloadmobile,
            reqloadpurpose
        });

        try {
            const InsertLoadRequests = await SimCardLoadingModel.InsertLoadRequests(AgentId, AgentName, Campaign, reqloadmobile, reqloadpurpose, amount);
            if (!InsertLoadRequests || InsertLoadRequests.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: `Failed to Request Load for ${reqloadmobile}`
                });
            }

            const Description = `Load request by Agent ${AgentId} for "${reqloadpurpose}" — Mobile Number: ${reqloadmobile}.`;

            const InsertNotification = await SimCardLoadingModel.Notification(AgentId, Description);
            if (!InsertNotification || InsertNotification.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: `Failed to Insert Load Notifications`
                });
            }

            return res.status(200).json({
                success: true,
                message: `Successfully Requested load for ${reqloadmobile}`
            });
        } catch (error) {
            console.warn(error);
            return res.status(400).json({
                success: false,
                message: 'Error in Inserting Load Request', error
            })
        }
    }
}

module.exports = SimCardLoadingController;