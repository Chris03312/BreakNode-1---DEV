const SimCardLoadingModel = require('../../models/agent/SimCardLoadingModel');

const SimCardLoadingController = {
    InsertLoadRequest: async (req, res) => {
        const { AgentId, AgentName, Campaign, reqloadmobile, reqloadpurpose } = req.body;

        console.log({
            AgentId,
            AgentName,
            Campaign,
            reqloadmobile,
            reqloadpurpose
        });

        try {
            const InsertLoadRequests = await SimCardLoadingModel.InsertLoadRequests(AgentId, AgentName, Campaign, reqloadmobile, reqloadpurpose);
            if (!InsertLoadRequests || InsertLoadRequests.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: `Failed to Request Load for ${reqloadmobile}`
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