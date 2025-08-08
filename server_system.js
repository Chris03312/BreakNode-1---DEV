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
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const apiRoutes = require('./routes/routesconfig/routes');
const pageRoutes = require('./routes/routesconfig/pages');

app.use(apiRoutes);
app.use(pageRoutes);

// Cron Job
const { runArchiveSync } = require('./controllers/break/DashboardController');
cron.schedule('* * * * *', async () => {
    console.log('[AUTO ARCHIVE] Running at midnight...');
    const result = await runArchiveSync();
    console.log('[ARCHIVE RESULT]', result.message);
});

// Server
const Config = {
    PORT: 3000,
    HOST: 'localhost'
};

app.listen(Config.PORT, () => console.log(`Listening on http://${Config.HOST}:${Config.PORT}`));
