const express = require('express');

const router = express.Router();

const AdminAuthenticationController = require('../../controllers/admin/AuthenticationController');
const { AdminLoginValidation } = require('../../middlewares/admin/AuthenticationMiddleware');

router.post('/login', AdminLoginValidation, AdminAuthenticationController.AdminLogin);

module.exports = router;
