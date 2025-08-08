const express = require('express');

const router = express.Router();

const AuthenticationController = require('../../controllers/agent/AuthenticationController');
const { AgentLoginValidation } = require('../../middlewares/agent/AuthenticationMiddleware');

router.post('/login', AgentLoginValidation, AuthenticationController.AgentLogin);

module.exports = router;
