const express = require('express');

const router = express.Router();

const UsersController = require('../../controllers/admin/UserController');
// const { UsersDataValidation } = require('../../middlewares/admin/UsersMiddleware');

// router.get('/schedule', UsersController.AgentsSchedule);
router.get('/userDatas', UsersController.AgentsData);
router.post('/editDatas', UsersController.AgentEditData);
router.post('/editUsers', UsersController.AgentEditUser);
router.post('/deleteUsers', UsersController.AgentDeleteUser);
router.post('/insertUsers', UsersController.AgentInsertUser);

// router.post('/updateDatas', UsersController.UpdateUsers);
// router.post('/deleteDatas', UsersController.DeleteUsers);
// router.get('/searchUsers', UsersController.SearchUsers);
// router.post('/updateSchedules', UsersController.UpdateUsersSchedule);

// router.post('/insertUser', UsersDataValidation, UsersController.InsertUser);


module.exports = router;
