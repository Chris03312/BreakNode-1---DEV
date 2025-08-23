const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cron = require('node-cron');

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'includes'));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
const apiRoutes = require('./routes/routesconfig/routes');
const pageRoutes = require('./routes/routesconfig/pages');

app.use(apiRoutes);
app.use(pageRoutes);

// Cron Job
const { runArchiveSync } = require('./controllers/break/DashboardController');
const AdminUserController = require('./controllers/admin/UserController');
cron.schedule('0 * * * *', async () => {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    console.log(`[AUTO ARCHIVE] Running at: ${formattedDate}`);
    const result = await runArchiveSync();
    console.log('[ARCHIVE RESULT]', result.message);
});
cron.schedule('0 * * * *', async () => {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    console.log(`[AUTO ARCHIVE] Starting midnight Endorsement Archive... ${formattedDate}`);

    // Somewhere in your startup script
    await AdminUserController.runArchiveEndorsementSync().then(result => {
        console.log('📁 Startup archive result:', result.message);
    });

});

// Server
const Config = {
    PORT: 5000,
    HOST: 'localhost'
};

app.listen(Config.PORT, () => console.log(`Listening on http://${Config.HOST}:${Config.PORT}`));

// Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process