const express = require('express');
const router = express.Router();

const UsersController = require('../../controllers/agent/UsersController');

router.post('/endorsementData', UsersController.EndorsementData);
router.post('/hardphoneData', UsersController.HardphoneData);
router.post('/hardphoneUpdate', UsersController.UpdateHardPhoneData);



module.exports = router;
