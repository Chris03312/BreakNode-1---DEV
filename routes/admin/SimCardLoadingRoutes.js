const express = require('express');

const router = express.Router();

const SimLoadingController = require('../../controllers/admin/SimLoadingController.js');

router.get('/simLoadingDatas', SimLoadingController.GetSimCardDatas);
router.get('/countSimRequest', SimLoadingController.CountSimRequest);

module.exports = router;
