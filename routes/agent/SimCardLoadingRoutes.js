const express = require('express');

const router = express.Router();

const SimCardLoadingController = require('../../controllers/agent/SimCardLoadingController');
const { AgentLoadRequest } = require('../../middlewares/agent/SimCardLoadingMiddleware');

router.post('/insertLoadRequest', AgentLoadRequest, SimCardLoadingController.InsertLoadRequest);

module.exports = router;
