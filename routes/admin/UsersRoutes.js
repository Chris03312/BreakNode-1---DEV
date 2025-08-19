const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const UsersController = require('../../controllers/admin/UserController');
// const { UsersDataValidation } = require('../../middlewares/admin/UsersMiddleware');
const upload = multer({ dest: 'temp/' });

router.get('/userDatas', UsersController.AgentsData);
router.post('/editDatas', UsersController.AgentEditData);
router.post('/editUsers', UsersController.AgentEditUser);
router.post('/deleteUsers', UsersController.AgentDeleteUser);
router.post('/insertUsers', UsersController.AgentInsertUser);
router.post('/insertEndorsement',
    upload.fields([
        { name: 'endorsementFileMEC', maxCount: 1 },
        { name: 'endorsementFileMPL', maxCount: 1 }
    ]),
    UsersController.AdminInsertEndorsement
);

// router.post('/updateDatas', UsersController.UpdateUsers);
// router.post('/deleteDatas', UsersController.DeleteUsers);
// router.get('/searchUsers', UsersController.SearchUsers);
// router.post('/updateSchedules', UsersController.UpdateUsersSchedule);

// router.post('/insertUser', UsersDataValidation, UsersController.InsertUser);


module.exports = router;
