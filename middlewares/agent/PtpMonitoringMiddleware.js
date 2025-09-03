const PtpMonitoringModel = require('../../models/agent/PtpMonitoringModel');

async function PtpMonitoringValidation(req, res, next) {
    const { ClientName, PtpEmail, PtpAccountNumber, PtpMobileNumber, PtpAmount, PtpDpd, AgentName, AgentId, Campaign } = req.body;

    if (!ClientName || !PtpEmail || !PtpAccountNumber || !PtpMobileNumber || !PtpAmount || !PtpDpd || !AgentName || !AgentId || !Campaign) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    try {
        const CheckDuplicatePtp = await PtpMonitoringModel.CheckDuplicatePtps(AgentId, Campaign, PtpAccountNumber);

        if (CheckDuplicatePtp.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Client "${ClientName}" (Account No. ${PtpAccountNumber}) already Recorded`
            });
        }

        return next()
    } catch (error) {
        console.error('Validation error:', error);
        return res.status(400).json({
            success: false,
            message: 'Server error during Check PTP Duplicates.'
        });
    }
}

module.exports = { PtpMonitoringValidation };