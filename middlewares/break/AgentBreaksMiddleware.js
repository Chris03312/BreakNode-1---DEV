const BreaksModel = require('../../models/break/BreaksModel');

async function AgentBreakOutScheduleValidation(req, res, next) {
    const { UserIdOut } = req.body;

    if (!UserIdOut || !UserIdOut.trim()) {
        return res.status(200).json({
            success: false,
            message: 'Invalid User ID',
        });
    }

    try {
        const BreakDetails = await BreaksModel.BreakDetails(UserIdOut);
        if (!BreakDetails || BreakDetails.length === 0) {
            return res.status(200).json({
                success: false,
                message: `User ID ${UserIdOut} Not Found`,
            });
        }

        const checkStatus = await BreaksModel.CheckAgentStatus(UserIdOut);
        if (checkStatus.length > 0 && checkStatus[0].status === 'Disabled') {
            return res.status(200).json({
                success: false,
                message: `Your account is disabled due to multiple Over Break attempts. Inform your Team Leader.`,
            });
        }

        const checkSchedule = await BreaksModel.CheckSchedule(UserIdOut);
        if (!checkSchedule || checkSchedule.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No schedule found for this user.',
            });
        }
        const schedule = checkSchedule[0];

        const breakScheduleMap = {
            '15 Minutes Break': { start: schedule.FffBreak, end: schedule.FftBreak },
            '1 Hour Break': { start: schedule.FoneHour, end: schedule.ToneHour },
            '10 Minutes Break': { start: schedule.SffBreak, end: schedule.SftBreak },
        };

        const options = {
            timeZone: 'Asia/Manila',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        };
        const currentTimeStr = new Date().toLocaleTimeString('en-US', options);
        const [currH, currM] = currentTimeStr.split(':').map(Number);
        const currentTotalMin = currH * 60 + currM;

        let breakTypeOut = null;

        for (const [breakType, times] of Object.entries(breakScheduleMap)) {
            const [startH, startM] = times.start.split(':').map(Number);
            const [endH, endM] = times.end.split(':').map(Number);

            const startTotalMin = startH * 60 + startM;
            const endTotalMin = endH * 60 + endM;

            if (currentTotalMin >= startTotalMin && currentTotalMin <= endTotalMin) {
                breakTypeOut = breakType;
                break;
            }
        }

        if (!breakTypeOut) {
            return res.status(200).json({
                success: false,
                message: 'You cannot take a break now. Not within any scheduled break time.',
            });
        }

        req.breakTypeOut = breakTypeOut;
        req.UserIdOut = UserIdOut;
        req.status = checkStatus[0].status;
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: 'Server error during Agent Schedule Break Out Validation.',
        });
    }
}


async function AgentBreakInScheduleValidation(req, res, next) {
    const { UserIdIn } = req.body;

    if (!UserIdIn || !UserIdIn.trim()) {
        return res.status(200).json({
            success: false,
            message: 'Invalid User ID',
        });
    }

    try {
        const BreakDetails = await BreaksModel.BreakDetails(UserIdIn);
        if (!BreakDetails || BreakDetails.length === 0) {
            return res.status(200).json({
                success: false,
                message: `User ID ${UserIdIn} Not Found`,
            });
        }

        const checkStatus = await BreaksModel.CheckAgentStatus(UserIdIn);
        if (checkStatus.length > 0 && checkStatus[0].status === 'Disabled') {
            return res.status(200).json({
                success: false,
                message: `Your account is disabled due to multiple Over Break attempts. Inform your Team Leader.`,
            });
        }


        const checkSchedule = await BreaksModel.CheckSchedule(UserIdIn);
        if (!checkSchedule || checkSchedule.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No schedule found for this user.',
            });
        }

        const schedule = checkSchedule[0];

        const breakScheduleMap = {
            '15 Minutes Break': { start: schedule.FffBreak, end: schedule.FftBreak },
            '1 Hour Break': { start: schedule.FoneHour, end: schedule.ToneHour },
            '10 Minutes Break': { start: schedule.SffBreak, end: schedule.SftBreak },
        };

        const options = {
            timeZone: 'Asia/Manila',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        };

        const currentTimeStr = new Date().toLocaleTimeString('en-US', options);
        const [currH, currM] = currentTimeStr.split(':').map(Number);
        const currentTotalMin = currH * 60 + currM;

        const allStartTimes = Object.values(breakScheduleMap).map(({ start }) => {
            const [h, m] = start.split(':').map(Number);
            return h * 60 + m;
        });

        const allEndTimes = Object.values(breakScheduleMap).map(({ end }) => {
            const [h, m] = end.split(':').map(Number);
            return h * 60 + m;
        });

        const earliestStart = Math.min(...allStartTimes);
        if (currentTotalMin < earliestStart) {
            return res.status(200).json({
                success: false,
                message: 'You cannot take a break now. Not within any scheduled break time.',
            });
        }

        let breakTypeIn = null;
        let breakSchedule = null;


        for (const [type, times] of Object.entries(breakScheduleMap)) {
            const [startH, startM] = times.start.split(':').map(Number);
            const [endH, endM] = times.end.split(':').map(Number);

            const startTotalMin = startH * 60 + startM;
            const endTotalMin = endH * 60 + endM;

            if (currentTotalMin >= startTotalMin && currentTotalMin <= endTotalMin) {
                breakTypeIn = type;
                breakSchedule = times;
                break;
            }
        }

        if (!breakTypeIn) {
            const latestEnd = Math.max(...allEndTimes);
            if (currentTotalMin > latestEnd) {
                const lastBreakEntry = Object.entries(breakScheduleMap)
                    .find(([, times]) => {
                        const [endH, endM] = times.end.split(':').map(Number);
                        return (endH * 60 + endM) === latestEnd;
                    });
                const [lastBreakType, lastBreakTimes] = lastBreakEntry;

                return res.status(200).json({
                    success: false,
                    message: `The ${lastBreakType} is over. The schedule ended at ${lastBreakTimes.end}. Please inform authorized personnel to Break In.`
                });
            }

            return res.status(200).json({
                success: false,
                message: 'You cannot take a break now. Not within any scheduled break time.',
            });
        }

        req.breakTypeIn = breakTypeIn;
        req.UserIdIn = UserIdIn;
        next();

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: 'Server error during Agent Schedule Break In Validation.',
        });
    }
}


async function AgentBreaksInValidation(req, res, next) {
    const { UserIdIn } = req.body;
    const breakTypeIn = req.breakTypeIn;

    console.log(breakTypeIn, UserIdIn);
    try {
        const CheckBreakIn = await BreaksModel.CheckBreakOut(UserIdIn, breakTypeIn);

        if (!CheckBreakIn || CheckBreakIn.length === 0) {
            return res.status(200).json({
                success: false,
                message: `Your ${breakTypeIn} is already ended. Please inform authorized personnel to Break In. [Over Break] `
            });
        }

        const CheckBreakOutnIn = await BreaksModel.CheckBreakOutnIn(UserIdIn, breakTypeIn);

        if (CheckBreakOutnIn && CheckBreakOutnIn.length > 0) {
            return res.status(200).json({
                success: false,
                message: `You already took your ${breakTypeIn}.`
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
    const BreakTypeOut = req.breakTypeOut;
    const UserIdOut = req.UserIdOut;

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
