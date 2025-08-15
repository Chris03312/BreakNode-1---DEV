const express = require('express');

const router = express.Router();

const EmailRequestController = require('../../controllers/agent/EmailRequestController');
const { AgentEmailRequestValidation } = require('../../middlewares/agent/EmailRequestMiddleware');

router.post('/emailRequest', EmailRequestController.GetEmailRequestData);
router.post('/emailEditRequest', EmailRequestController.AgentEmailEditDatas);
router.post('/emailUpdateRequest', EmailRequestController.AgentEmailUpdateDatas);
router.post('/insertEmailRequest', AgentEmailRequestValidation, EmailRequestController.InsertAgentEmailRequest);

module.exports = router;
