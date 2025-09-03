const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Cooldown tracking
const lockedLines = new Set();
const LOCK_DELAY_MS = 10000; // 10 seconds

// Queue DB
const insertQueue = db.prepare(`
  INSERT INTO sms_queue (phone, message)
  VALUES (?, ?)
`);

const getPendingMessage = db.prepare(`
  SELECT * FROM sms_queue ORDER BY id ASC LIMIT 1
`);

const deleteMessage = db.prepare(`
  DELETE FROM sms_queue WHERE id = ?
`);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function trySend(phone, message, line) {
    return new Promise((resolve, reject) => {
        const goipURL = `http://192.168.3.250/default/en_US/send.html?u=admin&p=admin&l=${line}&n=${phone}&m=${encodeURIComponent(message)}`;
        const curlCmd = `curl -s --max-time 5 "${goipURL}"`;

        lockedLines.add(line);

        exec(curlCmd, (err, stdout, stderr) => {
            if (err) {
                console.error(`❌ Curl error on line ${line}: ${err.message}`);
                lockedLines.delete(line); 
                return reject({ line, error: err.message });
            }

            console.log(`✅ SMS sent via Line ${line}`);


            setTimeout(() => {
                lockedLines.delete(line);
                console.log(`⏳ Line ${line} unlocked after cooldown`);
            }, LOCK_DELAY_MS);

            resolve({ line, response: stdout });
        });
    });
}

let lastUsedLine = 0;

app.post('/send-sms', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).send('Missing phone or message');
    }

    for (let i = 1; i <= 12; i++) {
        const line = (lastUsedLine + i - 1) % 12 + 1;

        if (!lockedLines.has(line)) {
            try {
                const result = await trySend(phone, message, line);

                lastUsedLine = line;

                await delay(800); 

                return res.send(`<h3>✅ SMS Sent via Line ${result.line}</h3><pre>${result.response}</pre><a href="/">Go Back</a>`);
            } catch (err) {
                console.warn(`Line ${line} failed. Trying next...`);
            }
        } else {
            await delay(100); 
        }
    }

    insertQueue.run(phone, message);
    return res.send(`<h3>⚠️ SMS Queued</h3><p>All lines busy or cooling down. Message has been queued.</p><a href="/">Go Back</a>`);
});


// 🔁 Queue Worker — checks every 10 seconds
setInterval(() => {
    const pending = getPendingMessage.get();
    if (!pending) return;

    for (let line = 1; line <= 12; line++) {
        if (!lockedLines.has(line)) {
            trySend(pending.phone, pending.message, line)
                .then(() => {
                    deleteMessage.run(pending.id); // ✅ Remove from queue after send
                })
                .catch(err => {
                    console.warn(`❌ Failed to send message from queue: ${err.error}`);
                    // Do not delete, message stays in queue for retry
                });
            break;
        }
    }
}, 8000);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
