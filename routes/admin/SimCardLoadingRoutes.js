const express = require('express');

const router = express.Router();

const SimCardLoadingController = require('../../controllers/admin/SimCardLoadingController.js');

router.get('/simLoadingDatas', SimCardLoadingController.GetSimCardDatas);
router.get('/countSimRequest', SimCardLoadingController.CountSimRequest);
router.post('/confirmLoadRequest', SimCardLoadingController.confirmLoadRequest);

module.exports = router;
