const express = require('express');

const router = express.Router();

const UsersController = require('../../controllers/break/UsersController');

router.get('/schedule', UsersController.AgentsSchedule);
router.get('/agentwithoutsched', UsersController.AgentWithoutSchedule);
router.post('/insertSchedule', UsersController.AgentInsertSchedule);
router.post('/editSchedule', UsersController.AgentEditScheduleDatas);
router.post('/updateSchedule', UsersController.AgentUpdateSchedule);
router.post('/deleteSchedule', UsersController.AgentDeleteSchedule);


module.exports = router;
