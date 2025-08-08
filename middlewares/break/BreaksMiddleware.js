const BreaksModel = require('../../models/break/BreaksModel');

async function BreaksInValidation(req, res, next) {
    const { UserIdIn, BreakTypeIn } = req.body;

    if (!/^\d+$/.test(UserIdIn.trim())) {
        return res.status(200).json({
            success: false,
            message: 'Invalid User ID'
        });
    }
    try {
        const CheckBreakOutDetails = await BreaksModel.BreakDetails(UserIdIn);

        if (!CheckBreakOutDetails || CheckBreakOutDetails.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No user found!'
            });
        }

        const CheckBreakOut = await BreaksModel.CheckBreakOut(UserIdIn, BreakTypeIn);

        if (CheckBreakOut && CheckBreakOut.length === 0) {
            return res.status(200).json({
                success: false,
                message: `You're not currently on a ${BreakTypeIn}.`
            });
        }

        const CheckBreakOutnIn = await BreaksModel.CheckBreakOutnIn(UserIdIn, BreakTypeIn);

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
        const CheckBreakOutDetails = await BreaksModel.BreakDetails(UserIdOut);

        if (!CheckBreakOutDetails || CheckBreakOutDetails.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No user found!'
            });
        }

        const CheckActiveBreakOut = await BreaksModel.CheckActiveBreakOut(UserIdOut);

        if (CheckActiveBreakOut && CheckActiveBreakOut.length > 0) {
            return res.status(200).json({
                success: false,
                message: `You have an active ${CheckActiveBreakOut[0].breakType}. Please Break In first.`
            });
        }

        const CheckBreakInnOut = await BreaksModel.CheckBreakInnOut(UserIdOut, BreakTypeOut);

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
