const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const logFile = path.join(__dirname, 'cron-log.txt');

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

app.listen(PORT, () => {
  console.log(`✅ Dashboard running at http://localhost:${PORT}`);
});
