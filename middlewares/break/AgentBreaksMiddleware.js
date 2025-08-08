const BreaksModel = require('../../models/break/BreaksModel');

async function AgentBreakOutScheduleValidation(req, res, next) {
    const { UserIdOut, BreakTypeOut, Password } = req.body;

    if (!/^\d+$/.test(UserIdOut.trim())) {
        return res.status(200).json({
            success: false,
            message: 'Invalid User ID'
        });
    }

    try {
        const BreakDetails = await BreaksModel.BreakDetails(UserIdOut);
        if (!BreakDetails || BreakDetails.length === 0) {
            return res.status(200).json({
                success: false,
                message: `User ID ${UserIdOut} Not Found`
            });
        }

        const Authentication = await BreaksModel.BreakDetailsWithPassword(UserIdOut);
        if (!Authentication || Authentication.length === 0) {   
            return res.status(200).json({
                success: false,
                message: 'Invalid User ID and Password'
            });
        }

        const checkStatus = await BreaksModel.CheckAgentStatus(UserIdOut);
        if (checkStatus.length > 0 && checkStatus[0].status === 'Disabled') {
            return res.status(200).json({
                success: false,
                message: `Your account is disabled due to multiple Over Break attempts. Inform your Team Leader.`
            });
        }

        const checkSchedule = await BreaksModel.CheckSchedule(UserIdOut);
        const schedule = checkSchedule[0];

        const breakScheduleMap = {
            '15 Minutes Break': { start: schedule.FffBreak, end: schedule.FftBreak },
            '1 Hour Break': { start: schedule.FoneHour, end: schedule.ToneHour },
            '10 Minutes Break': { start: schedule.SffBreak, end: schedule.SftBreak },
        };

        const breakSchedule = await breakScheduleMap[BreakTypeOut];
        if (!breakSchedule) {
            return res.status(200).json({
                success: false,
                message: `Invalid break type: ${BreakTypeOut}`
            });
        }

        const options = {
            timeZone: 'Asia/Manila',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const currentTime = new Date().toLocaleTimeString('en-US', options);
        const [currH, currM] = currentTime.split(':').map(Number);
        const [startH, startM] = breakSchedule.start.split(':').map(Number);
        const [endH, endM] = breakSchedule.end.split(':').map(Number);

        const currentTotalMin = currH * 60 + currM;
        const startTotalMin = startH * 60 + startM;
        const endTotalMin = endH * 60 + endM;

        if (currentTotalMin < startTotalMin) {
            return res.status(200).json({
                success: false,
                message: `It's not yet time for your ${BreakTypeOut}. Your schedule starts at ${breakSchedule.start}.`
            });
        }

        if (currentTotalMin > endTotalMin) {
            return res.status(200).json({
                success: false,
                message: `You cannot take your ${BreakTypeOut} because it's already over. The schedule ended at ${breakSchedule.end}.`
            });
        }

        return next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: 'Server error during Agent Schedule Break Out Middleware.'
        });
    }
}


async function AgentBreakInScheduleValidation(req, res, next) {
    const { UserIdIn, BreakTypeIn, Password } = req.body;

    if (!/^\d+$/.test(UserIdIn.trim())) {
        return res.status(200).json({
            success: false,
            message: 'Invalid User ID'
        });

    }

    try {
        const BreakDetails = await BreaksModel.BreakDetails(UserIdIn);
        if (!BreakDetails || BreakDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: `User ID ${UserIdIn} Not Found`
            });
        }

        const Authentication = await BreaksModel.BreakDetailsWithPassword(UserIdIn, Password);
        if (!Authentication || Authentication.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Invalid User ID and Password'
            });
        }

        const checkStatus = await BreaksModel.CheckAgentStatus(UserIdIn);
        if (checkStatus.length > 0 && checkStatus[0].status === 'Disabled') {
            return res.status(200).json({
                success: false,
                message: `Your account is disabled due to multiple Over Break attempts. Inform your Team Leader.`
            });
        }

        const checkSchedule = await BreaksModel.CheckSchedule(UserIdIn);
        const schedule = checkSchedule[0];

        const breakScheduleMap = {
            '15 Minutes Break': { start: schedule.FffBreak, end: schedule.FftBreak },
            '1 Hour Break': { start: schedule.FoneHour, end: schedule.ToneHour },
            '10 Minutes Break': { start: schedule.SffBreak, end: schedule.SftBreak },
        };

        const breakSchedule = breakScheduleMap[BreakTypeIn];

        if (!breakSchedule) {
            return res.status(200).json({
                success: false,
                message: `Invalid break type: ${BreakTypeIn}`
            });
        }

        const options = {
            timeZone: 'Asia/Manila',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const currentTime = new Date().toLocaleTimeString('en-US', options);

        const [currH, currM] = currentTime.split(':').map(Number);
        const [startH, startM] = breakSchedule.start.split(':').map(Number);
        const [endH, endM] = breakSchedule.end.split(':').map(Number);

        const currentTotalMin = currH * 60 + currM;
        const startTotalMin = startH * 60 + startM;
        const endTotalMin = endH * 60 + endM;

        if (currentTotalMin < startTotalMin) {
            return res.status(200).json({
                success: false,
                message: `It's not yet time for your ${BreakTypeIn}. Your schedule starts at ${breakSchedule.start}.`
            });
        }

        if (currentTotalMin > endTotalMin) {
            return res.status(200).json({
                success: false,
                message: `The ${BreakTypeIn} is Over. The schedule ended at ${breakSchedule.end} . Please inform Authorize personel to Break In`
            });
        }

        return next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: 'Server error during Agent Schedule Break In Middleware.'
        });
    }
}

async function AgentBreaksInValidation(req, res, next) {
    const { UserIdIn, BreakTypeIn, Password } = req.body;

    try {
        const CheckBreakIn = await BreaksModel.CheckBreakOut(UserIdIn, BreakTypeIn);

        if (!CheckBreakIn || CheckBreakIn.length === 0) {
            return res.status(200).json({
                success: false,
                message: `You're not currently on a ${BreakTypeIn}.`
            });
        }

        const CheckBreakOutnIn = await BreaksModel.CheckBreakOutnIn(UserIdIn, BreakTypeIn);

        if (CheckBreakOutnIn && CheckBreakOutnIn.length > 0) {
            return res.status(200).json({
                success: false,
                message: `You already took your ${BreakTypeIn}.`
            });
        }

        return next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: 'Server error Agent Break In Middleware.'
        });
    }
}

async function AgentBreaksOutValidation(req, res, next) {
    const { UserIdOut, BreakTypeOut, Password } = req.body;

    try {
        const CheckActiveBreakOut = await BreaksModel.CheckActiveBreakOut(UserIdOut, BreakTypeOut);

        if (CheckActiveBreakOut && CheckActiveBreakOut.length > 0) {
            return res.status(200).json({
                success: false,
                message: `You're already on a ${CheckActiveBreakOut[0].breakType}. Please Break In first.`
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
            message: 'Server error during Agent Break Middleware.'
        });
    }
}




module.exports = { AgentBreakOutScheduleValidation, AgentBreakInScheduleValidation, AgentBreaksInValidation, AgentBreaksOutValidation };
