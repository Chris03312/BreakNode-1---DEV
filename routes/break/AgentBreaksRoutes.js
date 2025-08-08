const express = require('express');

const router = express.Router();

const AgentBreaksController = require('../../controllers/break/AgentBreaksController');

const { AgentBreakOutScheduleValidation, AgentBreakInScheduleValidation, AgentBreaksOutValidation, AgentBreaksInValidation } = require('../../middlewares/break/AgentBreaksMiddleware');

router.post('/agentbreakOut', AgentBreakOutScheduleValidation, AgentBreaksOutValidation, AgentBreaksController.BreakOut);
router.post('/agentbreakIn', AgentBreakInScheduleValidation, AgentBreaksInValidation, AgentBreaksController.BreakIn);

module.exports = router;
