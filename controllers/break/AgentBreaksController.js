const BreaksModel = require('../../models/break/BreaksModel');

const BreaksController = {
    BreakOut: async (req, res) => {
        const { UserIdOut } = req.body;
        const BreakTypeOut = req.breakTypeOut;
        const status = req.status;

        try {
            const BreakOutDetails = await BreaksModel.BreakDetails(UserIdOut);

            if (!BreakOutDetails || BreakOutDetails.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }

            const { name, campaign } = BreakOutDetails[0];
            const BreakOut = await BreaksModel.BreakOut(UserIdOut, name, campaign, BreakTypeOut);

            if (!BreakOut || BreakOut.changes === 0) {
                return res.status(500).json({
                    success: false,
                    message: 'Break Out not recorded. No rows affected.',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Break Out Successfully Recorded.',
                breakTypeOut: BreakTypeOut,
                status
            });

        } catch (error) {
            console.error('BreakOut Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during Agent Break Out process.',
            });
        }
    },

    BreakIn: async (req, res) => {
        const { UserIdIn } = req.body;
        const BreakTypeIn = req.breakTypeIn;    

        try {
            const BreakIn = await BreaksModel.BreakIn(UserIdIn, BreakTypeIn);
            if (!BreakIn) {
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
            if (BreakTypeIn === '10 Minutes Break') allowedMinutes = 11;
            else if (BreakTypeIn === '15 Minutes Break') allowedMinutes = 16;
            else if (BreakTypeIn === '1 Hour Break') allowedMinutes = 61; // fix casing here

            let remarks = '';
            if (diffMin < allowedMinutes) {
                remarks = 'Early';
            } else if (diffMin <= allowedMinutes + 1) {
                remarks = 'Late';
            } else {
                remarks = 'Over Break';
            }

            const remarksSaved = await BreaksModel.RemarksAndTimeDifference(UserIdIn, BreakTypeIn, TimeDifferenceText, remarks);
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
                BreakTypeIn,
                remarks
            });

        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: 'Server error during Break In User Records.'
            });
        }
    }
}

module.exports = BreaksController;