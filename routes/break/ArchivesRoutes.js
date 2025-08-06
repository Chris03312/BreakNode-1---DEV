const express = require('express');

const router = express.Router();

const ArchivesController = require('../../controllers/break/ArchivesController');
// const AuthenticationMiddleware = require('../middlewares/AuthenticationMiddleware');

router.get('/archiveDatas', ArchivesController.ArchivesData);
router.post('/downloadArchive', ArchivesController.download);
router.post('/archiveRecordsByDate', ArchivesController.ArchivesDataByDate);

module.exports = router;
