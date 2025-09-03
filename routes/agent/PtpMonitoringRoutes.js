const express = require('express');
const router = express.Router();

const PtpMonitoringController = require('../../controllers/agent/PtpMonitoringController');
const { PtpMonitoringValidation } = require('../../middlewares/agent/PtpMonitoringMiddleware');


router.post('/PtpDatas', PtpMonitoringController.GetPtpDatas);
router.post('/AgentPtpData', PtpMonitoringController.GetPtpCount);
router.post('/confirmedPtp', PtpMonitoringController.GetPtpCount);
router.post('/addPtp', PtpMonitoringValidation, PtpMonitoringController.InsertPtpData);

module.exports = router;
