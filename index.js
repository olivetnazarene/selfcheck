require('dotenv').config()
const { readFileSync } = require('fs');
const https = require('https');
const app = require('./main');

const port = process.env.NODE_PORT || 3000;

const enableHttps = process.env.ENABLE_HTTPS === 'true';

if (enableHttps) {
  if (!process.env.SSL_CERT || !process.env.SSL_KEY) {
    throw new Error("ENABLE_HTTPS=true but SSL_CERT/SSL_KEY not set");
  }

  const options = {
    cert: readFileSync(process.env.SSL_CERT),
    key: readFileSync(process.env.SSL_KEY),
  };

  https.createServer(options, app).listen(port, () => {
    console.log(`Serving on https://${process.env.NODE_URL || 'localhost'}:${port} (${new Date().toLocaleString()})`);
  });
} else {
  const server = app.listen(port, () => {
    console.log(`Serving on http://0.0.0.0:${server.address().port} (${new Date().toLocaleString()})`);
  });
}
