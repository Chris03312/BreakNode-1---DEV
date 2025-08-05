const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cron = require('node-cron');

const app = express();


const AutheticationRoutes = require('./routes/AuthenticationRoute');
const BreaksRoutes = require('./routes/BreaksRoutes');
const UsersRoutes = require('./routes/UsersRoutes');
const ArchivesRoutes = require('./routes/ArchivesRoutes');
const AgentBreaksRoutes = require('./routes/AgentBreaksRoutes');
// const DashboardRoutes = require('./routes/DashboardRoutes');

const DashboardController = require('./controllers/DashboardController');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});
app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'users.html'));
});
app.get('/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'schedule.html'));
});
app.get('/archive', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'archive.html'));
});
    
app.use('/Authentication', AutheticationRoutes);
// app.use('/dashboard', DashboardRoutes);
app.use('/Break', BreaksRoutes);
app.use('/Archive', ArchivesRoutes);
app.use('/Users', UsersRoutes);
app.use('/Agent', AgentBreaksRoutes);

const Config = {
    PORT: 3000,
    HOST: 'localhost' // if dev localhost // if build 192.168.3.240
}

// require('./configurations/sqliteTables');

const { runArchiveSync } = require('./controllers/DashboardController');

cron.schedule('* * * * *', async () => { // every midnight
    console.log('[AUTO ARCHIVE] Running at midnight...');
    const result = await runArchiveSync();
    console.log('[ARCHIVE RESULT]', result.message);
});


app.listen(Config.PORT, () => console.log(`Listening on http://${Config.HOST}:${Config.PORT}`));