const express = require('express');
const router = express.Router();

const UsersController = require('../../controllers/agent/UsersController');

router.post('/endorsementData', UsersController.EndorsementData);

module.exports = router;
