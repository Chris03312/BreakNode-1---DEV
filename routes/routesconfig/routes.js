const express = require('express');
const router = express.Router();

const LogoutRoutes = require('../LogoutRoutes');
const AdminAuthenticationRoutes = require('../admin/AuthenticationRoutes');
const AdminUsersRoutes = require('../admin/UsersRoutes');
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

router.use('/AgentAuthentication', AgentAuthenticationRoutes);

router.use('/Break', BreaksRoutes);
router.use('/Archive', ArchivesRoutes);
router.use('/User', UsersRoutes); // user routes break
router.use('/Agent', AgentBreaksRoutes);

module.exports = router;
