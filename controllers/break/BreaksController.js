const BreaksModel = require('../../models/break/BreaksModel');

const BreaksController = {
    Records: async (req, res) => {
        try {
            const records = await BreaksModel.Records();
            if (records && records.length > 0) {
                return res.status(200).json({
                    success: true,
                    data: records
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during fetching User Records.'
            });
        }
    },

    BreakOut: async (req, res) => {
        const { UserIdOut, BreakTypeOut } = req.body;

        try {

            const BreakOutDetails = await BreaksModel.BreakDetails(UserIdOut);

            const { name, campaign } = BreakOutDetails[0];

            const BreakOut = await BreaksModel.BreakOut(UserIdOut, name, campaign, BreakTypeOut);

            if (BreakOut && BreakOut.changes > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Break Out Successfully Recorded.'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Break Out User Records.'
            });
        }
    },

    BreakIn: async (req, res) => {
        const { UserIdIn, BreakTypeIn, Reason } = req.body;

        try {
            const breakInResult = await BreaksModel.BreakIn(UserIdIn, BreakTypeIn);
            if (!breakInResult) {
                return res.status(400).json({ success: false, message: 'Failed to process Break IN' });
            }

            const timeDifference = await BreaksModel.TimeDifference(UserIdIn, BreakTypeIn);
            if (!timeDifference || timeDifference.length === 0) {
                return res.status(400).json({ success: false, message: 'Failed to fetch time difference data' });
            }

            const { breakOut, breakIn } = timeDifference[0];
            if (!breakOut || !breakIn) {
                return res.status(400).json({ success: false, message: 'Incomplete break data' });
            }

            const [outH, outM, outS] = breakOut.split(':').map(Number);
            const [inH, inM, inS] = breakIn.split(':').map(Number);

            const outTotalMin = outH * 60 + outM + outS / 60;
            const inTotalMin = inH * 60 + inM + inS / 60;

            const diffMin = inTotalMin - outTotalMin;
            if (diffMin < 0) {
                return res.status(400).json({ success: false, message: 'Break In time is earlier than Break Out time' });
            }

            const hours = Math.floor(diffMin / 60);
            const minutes = Math.floor(diffMin % 60);
            const TimeDifferenceText = `${hours}h ${minutes}m`;

            let allowedMinutes = 60;
            if (BreakTypeIn === '10 Minutes Break') allowedMinutes = 12;
            else if (BreakTypeIn === '15 Minutes Break') allowedMinutes = 17;
            else if (BreakTypeIn === '1 hour Break') allowedMinutes = 62;

            console.log('diffMin:', diffMin);
            console.log('allowedMinutes:', allowedMinutes);
            console.log('diffMin < allowedMinutes:', diffMin < allowedMinutes);
            console.log('diffMin === allowedMinutes:', diffMin === allowedMinutes);

            let remarks = '';

            if (Reason && Reason.trim() !== '') {
                remarks = 'Disposition';
            } else {
                if (diffMin < allowedMinutes) {
                    remarks = 'Early';
                } else if (diffMin <= allowedMinutes) {
                    remarks = 'Late';
                } else {
                    remarks = 'Over Break';
                }
            }

            const remarksSaved = await BreaksModel.RemarksAndTimeDifference(UserIdIn, BreakTypeIn, TimeDifferenceText, remarks, Reason);
            if (!remarksSaved) {
                return res.status(400).json({ success: false, message: 'Failed to save remarks' });
            }

            if (remarks === 'Over Break') {
                const incremented = await BreaksModel.IncrementOverBreak(UserIdIn);
                if (!incremented) {
                    return res.status(400).json({ success: false, message: 'Failed to increment overbreak count' });
                }

                const OverBreakCount = await BreaksModel.GetOverBreakCount(UserIdIn);
                const Count = OverBreakCount[0]?.overBreak || 0;

                if (Count >= 3) {
                    const disabled = await BreaksModel.DisableUser(UserIdIn);
                    if (!disabled) {
                        return res.status(400).json({ success: false, message: 'Failed to disable user' });
                    }
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Break In Successfully Recorded!',
                remarks
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server error during Break In User Records.'
            });
        }
    },

    ActiveBreaks: async (req, res) => {
        try {
            const active = await BreaksModel.CheckBreakActive();

            if (active && active.length > 0) {
                return res.status(200).json({
                    success: true,
                    break: active,
                });
            } else {
                return res.status(200).json({
                    success: false,
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(200).json({
                success: false,
                message: 'Server error during Active Break Color.'
            });
        }
    }
}

module.exports = BreaksController;