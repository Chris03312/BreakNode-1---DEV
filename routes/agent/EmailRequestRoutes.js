const express = require('express');

const router = express.Router();

const EmailRequestController = require('../../controllers/agent/EmailRequestController');

router.post('/emailRequest', EmailRequestController.GetEmailRequestData);
router.post('/insertEmailRequest', EmailRequestController.InsertAgentEmailRequest);


module.exports = router;
