const express = require('express');

const router = express.Router();

const EmailRequestController = require('../../controllers/admin/EmailRequestController.js');

router.get('/emailRequest', EmailRequestController.GetEmailRequestData);

module.exports = router;
