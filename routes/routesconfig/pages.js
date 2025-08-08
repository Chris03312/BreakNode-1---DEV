const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.get('/break', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'break.html'));
});

router.get('/break/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'breaksystem', 'dashboard.html'));
});

router.get('/break/users', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'breaksystem', 'users.html'));
});

router.get('/break/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'breaksystem', 'schedule.html'));
});

router.get('/break/archive', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'breaksystem', 'archive.html'));
});

router.get('/agent/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'agent', 'dashboard', 'agent_dashboard.html'));
});

router.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin', 'dashboard', 'agent_dashboard.html'));
});

module.exports = router;
