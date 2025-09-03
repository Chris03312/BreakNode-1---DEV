// retry-queued-sms.js
const axios = require('axios');
const db = require('./db');

const selectOnePerLine = db.prepare(`
  SELECT * FROM sms_queue
  WHERE status = 'pending' AND line = ?
  ORDER BY created_at ASC
  LIMIT 1
`);

const updateStatus = db.prepare(`
  UPDATE sms_queue
  SET status = ?, retry_count = retry_count + 1, updated_at = CURRENT_TIMESTAMP, error = ?
  WHERE id = ?
`);

async function retry() {
    for (let line = 1; line <= 12; line++) {
        const msg = selectOnePerLine.get(line.toString());
        if (!msg) {
            console.log(`ℹ️ No pending message for line ${line}`);
            continue;
        }

        const goipURL = `http://192.168.3.250/default/en_US/send.html?u=admin&p=admin&l=${line}&n=${msg.phone}&m=${encodeURIComponent(msg.message)}`;

        try {
            const response = await axios.get(goipURL, { timeout: 5000 });
            console.log(`✅ Sent message ID ${msg.id} via Line ${line}`);
            updateStatus.run('sent', null, msg.id);
        } catch (err) {
            console.warn(`❌ Failed on Line ${line} for message ID ${msg.id}: ${err.message}`);
            updateStatus.run('pending', err.message, msg.id); // optional: mark as 'failed' after X retries
        }
    }
}

retry();
