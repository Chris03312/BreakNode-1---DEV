const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cron = require('node-cron');

const app = express();


const AuthenticationRoutes = require('./routes/break/AuthenticationRoute');
const BreaksRoutes = require('./routes/break/BreaksRoutes');
const UsersRoutes = require('./routes/break/UsersRoutes');
const ArchivesRoutes = require('./routes/break/ArchivesRoutes');
const AgentBreaksRoutes = require('./routes/break/AgentBreaksRoutes');
// const DashboardRoutes = require('./routes/break/DashboardRoutes'); // This one too


const DashboardController = require('./controllers/break/DashboardController');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard', 'break', 'dashboard.html'));
});
app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard', 'break', 'users.html'));
});
app.get('/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard', 'break', 'schedule.html'));
});
app.get('/archive', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard', 'break', 'archive.html'));
});

app.use('/Authentication', AuthenticationRoutes);
// app.use('/dashboard', DashboardRoutes);
app.use('/Break', BreaksRoutes);
app.use('/Archive', ArchivesRoutes);
app.use('/User', UsersRoutes);
app.use('/Agent', AgentBreaksRoutes);

const Config = {
    PORT: 3000,
    HOST: 'localhost' // if dev localhost // if build 192.168.3.240
}

// require('./configurations/sqliteTables');

const { runArchiveSync } = require('./controllers/break/DashboardController');

cron.schedule('* * * * *', async () => { // every midnight
    console.log('[AUTO ARCHIVE] Running at midnight...');
    const result = await runArchiveSync();
    console.log('[ARCHIVE RESULT]', result.message);
});


app.listen(Config.PORT, () => console.log(`Listening on http://${Config.HOST}:${Config.PORT}`));