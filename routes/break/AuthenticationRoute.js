const express = require('express');

const router = express.Router();

const AuthenticationController = require('../../controllers/break/AuthenticationController');
const { LoginValidation } = require('../../middlewares/break/AuthenticationMiddleware');

router.post('/login', LoginValidation, AuthenticationController.Login);

module.exports = router;
