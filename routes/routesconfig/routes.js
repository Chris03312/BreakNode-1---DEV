const express = require('express');
const router = express.Router();

const AgentAuthenticationRoutes = require('../agent/AuthenticationRoutes');
const AuthenticationRoutes = require('../break/AuthenticationRoute');
const BreaksRoutes = require('../break/BreaksRoutes');
const UsersRoutes = require('../break/UsersRoutes');
const ArchivesRoutes = require('../break/ArchivesRoutes');
const AgentBreaksRoutes = require('../break/AgentBreaksRoutes');

router.use('/Authentication', AuthenticationRoutes);
router.use('/AgentAuthentication', AgentAuthenticationRoutes);
router.use('/Break', BreaksRoutes);
router.use('/Archive', ArchivesRoutes);
router.use('/User', UsersRoutes);
router.use('/Agent', AgentBreaksRoutes);

module.exports = router;
