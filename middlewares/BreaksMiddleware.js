const BreaksModel = require('../models/BreaksModel');

async function BreaksInValidation(req, res, next) {
    const { UserIdIn, BreakTypeIn } = req.body;

    if (!/^\d+$/.test(UserIdIn.trim())) {
        return res.status(200).json({
            success: false,
            message: 'Invalid User ID'
        });
    }
    try {
        const CheckBreakOut = BreaksModel.CheckBreakOut(UserIdIn, BreakTypeIn);

        if (CheckBreakOut && CheckBreakOut.length === 0) {
            return res.status(200).json({
                success: false,
                message: `You're not currently on a ${BreakTypeIn}.`
            });
        }

        const CheckBreakOutnIn = BreaksModel.CheckBreakOutnIn(UserIdIn, BreakTypeIn);

        if (CheckBreakOutnIn && CheckBreakOutnIn.length > 0) {
            return res.status(200).json({
                success: false,
                message: `You already took your ${BreakTypeIn} today.`
            });
        }

        return next();
    } catch {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: 'Server error during Chech Break In Middelware'
        });
    }
}

async function BreaksOutValidation(req, res, next) {
    const { UserIdOut, BreakTypeOut } = req.body;

    if (!/^\d+$/.test(UserIdOut.trim())) {
        return res.status(200).json({
            success: false,
            message: 'Invalid User ID'
        });
    }

    try {
        const CheckActiveBreakOut = BreaksModel.CheckActiveBreakOut(UserIdOut);

        if (CheckActiveBreakOut && CheckActiveBreakOut.length > 0) {
            return res.status(200).json({
                success: false,
                message: `You're already on a ${CheckActiveBreakOut[0].breakType}. Please Break In first.`
            });
        }

        const CheckBreakInnOut = BreaksModel.CheckBreakInnOut(UserIdOut, BreakTypeOut);

        if (CheckBreakInnOut && CheckBreakInnOut.length > 0) {
            return res.status(200).json({
                success: false,
                message: `You already took your ${BreakTypeOut}.`
            });
        }

        return next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: 'Server error during Chech Break Out Middelware'
        });
    }
}

module.exports = { BreaksInValidation, BreaksOutValidation };
