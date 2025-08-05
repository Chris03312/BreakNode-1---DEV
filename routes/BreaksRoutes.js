const express = require('express');

const router = express.Router();

const BreaksController = require('../controllers/BreaksController');

const { BreaksInValidation, BreaksOutValidation } = require('../middlewares/BreaksMiddleware');

router.get('/records', BreaksController.Records);
router.get('/remarks', BreaksController.ActiveBreaks);
router.post('/breakOut', BreaksOutValidation, BreaksController.BreakOut);
router.post('/breakIn', BreaksInValidation, BreaksController.BreakIn);

module.exports = router;
