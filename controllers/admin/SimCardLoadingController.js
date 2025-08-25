const { userSockets } = require('../../socket');
const SimCardLoadingModel = require('../../models/admin/SimCardLoadingModel');

const SimCardLoadingController = {
    GetSimCardDatas: async (req, res) => {
        try {
            const simCardData = await SimCardLoadingModel.LoadRequestData();

            if (!simCardData || simCardData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No Available SIM Card Data',
                    simCards: []
                });
            }

            // Filter data based on campaign type
            const mecUsers = simCardData.filter(user =>
                user.campaign && user.campaign.startsWith('MEC') && !user.remarks.startsWith('Done')
            );

            const mplUsers = simCardData.filter(user =>
                user.campaign && user.campaign.startsWith('MPL') && !user.remarks.startsWith('Done')
            );

            const smsUsers = simCardData.filter(user =>
                user.campaign && user.campaign.startsWith('SMS') && !user.remarks.startsWith('Done')
            );

            return res.status(200).json({
                success: true,
                mec: mecUsers,
                mpl: mplUsers,
                sms: smsUsers,
                simCards: simCardData
            });

        } catch (error) {
            console.warn(error);
            return res.status(400).json({
                success: false,
                message: 'Error in loading SIM card data',
                error
            });
        }
    },
    CountSimRequest: async (req, res) => {
        try {
            const results = await SimCardLoadingModel.CountSimRequests();

            if (!results || results.length === 0) {
                return res.status(200).json({
                    success: true,
                    total: 0,
                    mec: 0,
                    mpl: 0,
                    sms: 0
                });
            }

            const { total, mec, mpl, sms } = results[0];

            return res.status(200).json({
                success: true,
                total,
                mec,
                mpl,
                sms
            });
        } catch (error) {
            console.warn(error);
            return res.status(400).json({
                success: false,
                message: 'Error in Counting Request Email',
                error
            });
        }
    },

    confirmLoadRequest: async (req, res) => {
        const { AgentId, Campaign, MobileNumber } = req.body;

        try {
            const confirmLoadRequest = await SimCardLoadingModel.ConfirmLoadRequests(AgentId, Campaign, MobileNumber);

            console.log('CONFIRM LOAD', confirmLoadRequest);

            if (!confirmLoadRequest || confirmLoadRequest.length === 0) {
                return res.status(200).json({ success: false });
            }

            const Description = `Load confirmed for ${MobileNumber}, by Agent ${AgentId}.`;

            const InsertNotification = await SimCardLoadingModel.Notification(AgentId, Description);
            if (!InsertNotification || InsertNotification.length === 0) {
                return res.status(200).json({ success: false });
            }

            // const socket = userSockets.get(AgentId);
            // if (socket) {
            //     socket.emit('new_notification', {
            //         agentId: AgentId,
            //         description: Description,
            //         status: 'unread',
            //         datetime: new Date().toLocaleString()
            //     });
            //     console.log(`🔔 Emitted notification to Agent ${AgentId}`);
            // } else {
            //     console.log(`❌ Agent ${AgentId} not connected`);
            // }

            return res.status(200).json({ success: true });
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

module.exports = SimCardLoadingController;
