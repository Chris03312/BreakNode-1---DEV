const express = require('express');

const router = express.Router();

const UsersController = require('../../controllers/break/UsersController');
const { UsersDataValidation } = require('../../middlewares/break/UsersMiddleware');

router.get('/userDatas', UsersController.UsersData);
router.post('/insertUser', UsersDataValidation, UsersController.InsertUser);
router.post('/editDatas', UsersController.EditUsers);
router.post('/updateDatas', UsersController.UpdateUsers);
router.post('/deleteDatas', UsersController.DeleteUsers);
router.get('/searchUsers', UsersController.SearchUsers);
router.post('/updateSchedules', UsersController.UpdateUsersSchedule);

module.exports = router;
