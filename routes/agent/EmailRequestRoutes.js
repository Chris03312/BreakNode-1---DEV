const express = require('express');

const router = express.Router();

const EmailRequestController = require('../../controllers/agent/EmailRequestController');
const { AgentEmailRequestValidation, AgentReEmailRequest, AgentLoadRequest } = require('../../middlewares/agent/EmailRequestMiddleware');


router.post('/countEmailRequest', EmailRequestController.CountEmailRequest);
router.post('/emailRequest', EmailRequestController.GetEmailRequestData);
router.post('/emailEditRequest', EmailRequestController.AgentEmailEditDatas);
router.post('/emailUpdateRequest', EmailRequestController.AgentEmailUpdateDatas);
router.post('/insertEmailRequest', AgentEmailRequestValidation, EmailRequestController.InsertAgentEmailRequest);
router.post('/reEmailRequest', AgentReEmailRequest, EmailRequestController.ReEmailRequest);
router.post('/insertViberRequest', EmailRequestController.InsertAgentViberRequest);

module.exports = router;