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
    },

    SendEmailRequest: async (req, res) => {
        const { AgentId, Email, ClientName, Amount, AccountNumber } = req.body;
        const AdminEmail = `catalan.christian.03312002@gmail.com`;
        const apppassword = 'vghwigmmxvylenpa';
        try {

            const UpdateEmailRemarks = await EmailRequestModel.UpdateEmailRemarks(AgentId, Email,);
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
        const { AgentId, Email, ConfirmedAmount } = req.body;

        try {
            const UpdateConfirmedEmail = await EmailRequestModel.UpdateConfirmedEmail(AgentId, Email, ConfirmedAmount);
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

    }

}

module.exports = EmailRequestController;
