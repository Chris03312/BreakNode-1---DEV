const EmailRequestModel = require('../../models/admin/EmailRequestModel.js');
const nodemailer = require('nodemailer');

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

            const today = new Date();

            for (const record of EmailRequestData) {
                const recordDate = new Date(record.date);

                if (recordDate < today) {
                    await EmailRequestModel.UpdateBrokenPTPS(
                        record.agentId,
                        record.email,
                        record.clientName,
                        record.accountNumber
                    );
                }
            }

            // 🔁 Re-fetch updated data after DB updates
            const UpdatedEmailRequestData = await EmailRequestModel.EmailRequestData();

            // Filter out only non-broken ones for display
            const filterNotBroken = user =>
                !(user.remarks || '').toLowerCase().startsWith('broken');

            const mec130EmailRequest = UpdatedEmailRequestData.filter(
                user => user.campaign.startsWith('MEC 1 - 30') &&
                    user.request.startsWith('Proof') &&
                    filterNotBroken(user)
            );

            const mec61EmailRequest = UpdatedEmailRequestData.filter(
                user => user.campaign.startsWith('MEC 61 AND UP') &&
                    user.request.startsWith('Proof') &&
                    filterNotBroken(user)
            );

            const mec121EmailRequest = UpdatedEmailRequestData.filter(
                user => user.campaign.startsWith('MEC 121 AND UP') &&
                    user.request.startsWith('Proof') &&
                    filterNotBroken(user)
            );

            const mecViberRequest = UpdatedEmailRequestData.filter(
                user => user.campaign.startsWith('MEC') &&
                    user.request.startsWith('Viber') &&
                    filterNotBroken(user)
            );

            const mpl130EmailRequest = UpdatedEmailRequestData.filter(
                user => user.campaign.startsWith('MPL 1 - 30') &&
                    user.request.startsWith('Proof') &&
                    filterNotBroken(user)
            );

            const mpl91EmailRequest = UpdatedEmailRequestData.filter(
                user => user.campaign.startsWith('MPL 91 AND UP') &&
                    user.request.startsWith('Proof') &&
                    filterNotBroken(user)
            );

            const mplViberRequest = UpdatedEmailRequestData.filter(
                user => user.campaign.startsWith('MPL') &&
                    user.request.startsWith('Viber') &&
                    filterNotBroken(user)
            );

            return res.status(200).json({
                success: true,
                mec130: mec130EmailRequest,
                mec61: mec61EmailRequest,
                mec121: mec121EmailRequest,
                mecViber: mecViberRequest,
                mpl130: mpl130EmailRequest,
                mpl91: mpl91EmailRequest,
                mplViber: mplViberRequest,
                emails: UpdatedEmailRequestData
            });

        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during getting email request data.'
            });
        }
    },

    SendEmailRequest: async (req, res) => {
        const { AgentId, Email, ClientName, Amount, AccountNumber, Campaign } = req.body;
        const AdminEmail = `catalan.christian.03312002@gmail.com`;
        const apppassword = 'vghwigmmxvylenpa';
        try {

            const UpdateEmailRemarks = await EmailRequestModel.UpdateEmailRemarks(AgentId, Campaign, AccountNumber);
            if (!UpdateEmailRemarks || UpdateEmailRemarks.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'Failed to Update Email Remarks'
                });
            }

            // Create transporter with direct credentials
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", // or your mail server
                port: 587,
                secure: false, // true for port 465, false for 587
                auth: {
                    user: `${AdminEmail}`, // your email
                    pass: `${apppassword}` // Gmail App Password
                }
            });

            // Email content
            const mailOptions = {
                from: `"Admin" <${AdminEmail}>`,
                to: Email,
                subject: "Payment Request Confirmation",
                html: `
                    <h3>Hello ${ClientName},</h3>
                    <p>This is a confirmation for your payment request:</p>
                    <ul>
                        <li><strong>Amount:</strong> ${Amount}</li>
                        <li><strong>Account Number:</strong> ${AccountNumber}</li>
                    </ul>
                    <p>Thank you for your cooperation.</p>
                `
            };

            // Send email   
            await transporter.sendMail(mailOptions);

            return res.status(200).json({
                success: true,
                message: `Email successfully sent to ${Email}`
            });

        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Sending email request data.'
            });
        }
    },

    ConfirmedAmount: async (req, res) => {
        const { AgentId, AccountNumber, ConfirmedAmount } = req.body;

        try {
            const UpdateConfirmedEmail = await EmailRequestModel.UpdateConfirmedEmail(AgentId, AccountNumber, ConfirmedAmount);

            if (!UpdateConfirmedEmail || UpdateConfirmedEmail.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'Failed to Update Confirmed Amount'
                });
            }

            return res.status(200).json({
                success: true,
                message: `Successfully Set the Confirmed Amount for Agent ${AgentId}`
            });
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Updating Confirmed Amount data.'
            });
        }

    },
    CountEmailRequest: async (req, res) => {
        try {
            const results = await EmailRequestModel.CountEmailRequests();

            if (!results || results.length === 0) {
                return res.status(200).json({
                    success: true,
                    total: 0,
                    mec: 0,
                    mpl: 0
                });
            }

            // results[0] contains the counts from SQL
            const { total, mec, mpl } = results[0];

            return res.status(200).json({
                success: true,
                total,
                mec,
                mpl
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
}

module.exports = EmailRequestController;
