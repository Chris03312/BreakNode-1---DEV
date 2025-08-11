const express = require('express');

const router = express.Router();

const UsersController = require('../../controllers/break/UsersController');

router.get('/schedule', UsersController.AgentsSchedule);
router.get('/agentwithoutsched', UsersController.AgentWithoutSchedule);

module.exports = router;
