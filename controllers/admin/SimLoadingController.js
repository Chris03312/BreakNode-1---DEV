const SimCardLoadingModel = require('../../models/admin/SimCardLoadingModel.js');

const SimLoadingController = {
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
                user.campaign && user.campaign.startsWith('MEC')
            );

            const mplUsers = simCardData.filter(user =>
                user.campaign && user.campaign.startsWith('MPL')
            );

            const smsUsers = simCardData.filter(user =>
                user.campaign && user.campaign.startsWith('SMS')
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
    }

}

module.exports = SimLoadingController;
