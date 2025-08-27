const express = require('express');
const router = express.Router();

const LogoutRoutes = require('../LogoutRoutes');
const AdminAuthenticationRoutes = require('../admin/AuthenticationRoutes');
const AdminUsersRoutes = require('../admin/UsersRoutes');
const AgentUsersRoutes = require('../agent/UsersRoutes');
const AdminEmailRequestRoutes = require('../admin/EmailRequestRoutes');
const AgentEmailRequestRoutes = require('../agent/EmailRequestRoutes');
const AdminSimCardLoadingRequestRoutes = require('../admin/SimCardLoadingRoutes');
const AgentSimCardLoadingRequestRoutes = require('../agent/SimCardLoadingRoutes');
const AgentAuthenticationRoutes = require('../agent/AuthenticationRoutes');

const AuthenticationRoutes = require('../break/AuthenticationRoute');
const BreaksRoutes = require('../break/BreaksRoutes');
const UsersRoutes = require('../break/UsersRoutes');
const ArchivesRoutes = require('../break/ArchivesRoutes');
const AgentBreaksRoutes = require('../break/AgentBreaksRoutes');

router.use('/Logout', LogoutRoutes);
router.use('/Authentication', AuthenticationRoutes);

router.use('/AdminAuthentication', AdminAuthenticationRoutes);
router.use('/AdminUsers', AdminUsersRoutes);
router.use('/AdminSimCardLoadingRequest', AdminSimCardLoadingRequestRoutes);
router.use('/AdminEmailRequest', AdminEmailRequestRoutes);

router.use('/AgentUsers', AgentUsersRoutes);
router.use('/AgentAuthentication', AgentAuthenticationRoutes);
router.use('/AgentEmailRequest', AgentEmailRequestRoutes);
router.use('/AgentSimCardLoadingRequest', AgentSimCardLoadingRequestRoutes);

router.use('/Break', BreaksRoutes);
router.use('/Archive', ArchivesRoutes);
router.use('/User', UsersRoutes); // user routes break
router.use('/Agent', AgentBreaksRoutes);

module.exports = router;
