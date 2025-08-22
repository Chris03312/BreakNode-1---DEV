const express = require('express');
const path = require('path');
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// break 
router.get('/break', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'break.html'));
});

router.get('/break/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'breaksystem', 'dashboard.html'));
});

router.get('/break/users', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'breaksystem', 'users.html'));
});

router.get('/break/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'breaksystem', 'schedule.html'));
});

router.get('/break/archive', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'breaksystem', 'archive.html'));
});




// agent collections dd
router.get('/agent/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'agent_dashboard.html'));
});
router.get('/agent/attendance', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'attendance', 'attendance.html'));
});
router.get('/agent/break', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'break', 'break.html'));
});
router.get('/agent/endorsement', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'endorsement', 'endorsement.html'));
});
router.get('/agent/ptpmonitoring', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'ptpmonitoring', 'ptpmonitoring.html'));
});
router.get('/agent/ptptracker', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'ptptracker', 'ptptracker.html'));
});
router.get('/agent/emailrequest', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'emailrequest', 'emailrequest.html'));
});
router.get('/agent/simcardloading', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'sim', 'simcardloading.html'));
});
router.get('/agent/unauthorize', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'unauthorize', 'unauthorize.html'));
});
router.get('/agent/autodeduction', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'deduction', 'autodeduction.html'));
});
router.get('/agent/mistake', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'mistake', 'mistake.html'));
});
router.get('/agent/smsinbound', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'inbound', 'smsinbound.html'));
});
router.get('/agent/smsblast', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'smsblast', 'smsblast.html'));
});
router.get('/agent/hardphone', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'agent', 'collections', 'hardphone', 'hardphone.html'));
});


// admin reports dd
router.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'admin_dashboard.html'));
});
router.get('/admin/attendance', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'attendance', 'attendance.html'));
});

// admin agent
router.get('/admin/agent', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'usermanagement', 'agentmanagement', 'users.html'));
});

// admin break
router.get('/admin/break', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'usermanagement', 'breakmanagement', 'break.html'));
});
router.get('/admin/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'usermanagement', 'breakmanagement', 'schedule.html'));
});

// admin reports
router.get('/admin/ptpmonitoring', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'reports', 'ptpmonitoring', 'ptpmonitoring.html'));
});
router.get('/admin/ptptracker', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'reports', 'ptptracker', 'ptptracker.html'));
});
router.get('/admin/emailrequest', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'reports', 'emailrequest', 'emailrequest.html'));
});
router.get('/admin/simcardloading', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'reports', 'sim', 'simcardloading.html'));
});
router.get('/admin/unauthorize', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'reports', 'unauthorize', 'unauthorize.html'));
});
router.get('/admin/autodeduction', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'reports', 'deduction', 'autodeduction.html'));
});
router.get('/admin/mistake', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'reports', 'mistake', 'mistake.html'));
});
router.get('/admin/smsinbound', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'reports', 'inbound', 'smsinbound.html'));
});


module.exports = router;
