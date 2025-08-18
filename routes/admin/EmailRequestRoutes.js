const express = require('express');

const router = express.Router();

const EmailRequestController = require('../../controllers/admin/EmailRequestController.js');

router.get('/countEmailRequest', EmailRequestController.CountEmailRequest);
router.get('/emailRequest', EmailRequestController.GetEmailRequestData);
router.post('/sendEmailRequest', EmailRequestController.SendEmailRequest);
router.post('/confirmedAmount', EmailRequestController.ConfirmedAmount);

module.exports = router;
