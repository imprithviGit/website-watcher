const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // so we can receive JSON POST data

const PORT = process.env.PORT || 3000;
const logFile = path.join(__dirname, 'cron-log.txt');

// Serve dashboard
app.get('/', (req, res) => {
  fs.readFile(logFile, 'utf8', (err, data) => {
    if (err) return res.send('No logs yet.');

    const html = `
      <html>
        <head><title>📝 Cron Dashboard</title>
        <style>
          body { font-family: monospace; background: #111; color: #0f0; padding: 20px; }
          pre { white-space: pre-wrap; word-wrap: break-word; }
        </style>
        </head>
        <body>
          <h1>🚀 Cron Logs</h1>
          <pre>${data}</pre>
        </body>
      </html>`;
    res.send(html);
  });
});

// ✅ NEW: Endpoint to receive logs from cron job
app.post('/log', (req, res) => {
  const { message } = req.body;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
  res.send({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✅ Dashboard running at http://localhost:${PORT}`);
});
