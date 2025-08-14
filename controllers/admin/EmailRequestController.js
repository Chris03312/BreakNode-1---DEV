const EmailRequestModel = require('../../models/admin/EmailRequestModel.js');

const EmailRequestController = {
    GetEmailRequestData: async (req, res) => {
        try {
            const EmailRequestData = await EmailRequestModel.EmailRequestData();

            if (!EmailRequestData || EmailRequestData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No Available Users Data',
                    emails: []
                });
            }

            // Match campaigns like "MEC 1 - 30", "MPL 1 - 30", etc.
            const mec130EmailRequest = EmailRequestData.filter(user => user.campaign.startsWith('MEC 1 - 30'));
            const mec61EmailRequest = EmailRequestData.filter(user => user.campaign.startsWith('MEC 61 AND UP'));
            const mec121EmailRequest = EmailRequestData.filter(user => user.campaign.startsWith('MEC 121 AND UP'));
            const mpl130EmailRequest = EmailRequestData.filter(user => user.campaign.startsWith('MPL 1 - 30'));
            const mpl91EmailRequest = EmailRequestData.filter(user => user.campaign.startsWith('MPL 91 AND UP'));

            return res.status(200).json({
                success: true,
                mec130: mec130EmailRequest,
                mec61: mec61EmailRequest,
                mec121: mec121EmailRequest,
                mpl130: mpl130EmailRequest,
                mpl91: mpl91EmailRequest,
                emails: EmailRequestData
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during getting email request data.'
            });
        }
    }

}

module.exports = EmailRequestController;
