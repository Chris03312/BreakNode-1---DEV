const express = require('express');

const router = express.Router();

const UsersController = require('../../controllers/break/UsersController');
const { UsersDataValidation } = require('../../middlewares/break/UsersMiddleware');

router.get('/schedule', UsersController.AgentsSchedule);
router.get('/userDatas', UsersController.AgentsData);
router.post('/editDatas', UsersController.EditUsers);
router.post('/updateDatas', UsersController.UpdateUsers);
router.post('/deleteDatas', UsersController.DeleteUsers);
router.get('/searchUsers', UsersController.SearchUsers);
router.post('/updateSchedules', UsersController.UpdateUsersSchedule);

router.post('/insertUser', UsersDataValidation, UsersController.InsertUser);


module.exports = router;
