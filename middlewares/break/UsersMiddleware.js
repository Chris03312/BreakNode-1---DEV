const UsersModel = require('../../models/break/UsersModel');

async function UsersDataValidation(req, res, next) {
    const { UserId, Name, Campaign, Password, FffBreak,
        FftBreak, FoneHour, ToneHour, SffBreak, SftBreak } = req.body;

    console.log(UserId, Name, Campaign, Password, FffBreak,
        FftBreak, FoneHour, ToneHour, SffBreak, SftBreak);

    if (!UserId.trim() || !Name.trim() || !Campaign.trim() || !FffBreak.trim() ||
        !FftBreak.trim() || !FoneHour.trim() || !ToneHour.trim() || !SffBreak.trim() || !SftBreak.trim()) {

        return res.status(400).json({
            success: false,
            message: 'Please fill in all fields.'
        });
    }

    if (!/^\d+$/.test(UserId.trim())) {
        return res.status(400).json({
            success: false,
            message: 'User ID must contain numbers only.'
        });
    }

    next();
}

module.exports = { UsersDataValidation };
