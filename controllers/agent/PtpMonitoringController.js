const PtpMonitoringModel = require('../../models/agent/PtpMonitoringModel');

const PtpMonitoringController = {
    GetPtpDatas: async (req, res) => {
        const { AgentId, Campaign } = req.body;

        try {
            const GetPtpData = await PtpMonitoringModel.GetPtpDatas(AgentId, Campaign);
            if (!GetPtpData || GetPtpData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: `Failed to Fetch PTP Datas.`
                });
            }

            return res.status(200).json({
                success: true,
                GetPtpData
            });
        } catch (error) {
            console.error('Validation error:', error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Fetching Ptp.'
            });
        }
    },
    GetPtpCount: async (req, res) => {
        const { AgentId, Campaign } = req.body;

        try {
            const getPtpCounts = await PtpMonitoringModel.CountPtpsPerAgent(AgentId, Campaign);

            if (!getPtpCounts || getPtpCounts.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: `No PTP count and amount found.`
                });
            }

            // Separate rows by scope
            const agentStats = getPtpCounts.find(row => row.scope === 'agent') || { PTPCOUNT: 0, PTPAMOUNT: 0 };
            const campaignStats = getPtpCounts.find(row => row.scope === 'campaign') || { PTPCOUNT: 0, PTPAMOUNT: 0 };

            return res.status(200).json({
                success: true,
                agent: agentStats,
                campaign: campaignStats
            });

        } catch (error) {
            console.error('Error fetching PTP data:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while fetching PTP data.'
            });
        }
    },
    GetPtpConfirmed: async (req, res) => {
        const { AgentId, Campaign } = req.body;

        try {
            const GetPtpsConfirmed = await PtpMonitoringModel.CountConfirmedPtps(AgentId, Campaign);
            if (!GetPtpsConfirmed || GetPtpsConfirmed.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: `No PTP count and amount found.`
                });
            }

            const agentStats = getPtpCounts.find(row => row.scope === 'agent') || { PTPCOUNT: 0, PTPAMOUNT: 0 };
            const campaignStats = getPtpCounts.find(row => row.scope === 'campaign') || { PTPCOUNT: 0, PTPAMOUNT: 0 };

            return res.status(200).json({
                success: true,
                agent: agentStats,
                campaign: campaignStats
            });
        } catch (error) {
            console.error('Error fetching PTP data:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while fetching Confirmed Amount data.'
            });
        }
    },
    InsertPtpData: async (req, res) => {
        const { ClientName, PtpEmail, PtpAccountNumber, PtpMobileNumber, PtpAmount, PtpDpd, AgentName, AgentId, Campaign } = req.body;

        try {
            const InsertPtpDatas = await PtpMonitoringModel.InsertPtpsDatas(ClientName, PtpEmail, PtpAccountNumber, PtpMobileNumber, PtpAmount, PtpDpd, AgentName, AgentId, Campaign);

            if (!InsertPtpDatas || InsertPtpDatas.changes === 0) {
                return res.status(200).json({
                    success: false,
                    message: `Failed to insert client "${ClientName}" with Account Number "${PtpAccountNumber}".`
                });
            }

            return res.status(200).json({
                success: true,
                message: `Client ${ClientName} successfully recorded`
            });
        } catch (error) {
            console.error('Validation error:', error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Insert Ptp.'
            });
        }
    }
}

module.exports = PtpMonitoringController;