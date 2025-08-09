const express = require('express');

const router = express.Router();

const LogoutController = require('../controllers/LogoutController');

router.post('/agentLogout', LogoutController.Logout);
router.post('/adminLogout', LogoutController.Logout);

module.exports = router;
