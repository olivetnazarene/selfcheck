const https = require('https');
const app = require('./main');

if (process.env.NODE_ENV == 'production') {
    const options = {
        cert: process.env.SSL_CERT,
        key: process.env.SSL_KEY
    }
    
    https.createServer(options, app).listen(process.env.NODE_PORT || 3000, () => {
        console.log(`Serving on https://${process.env.NODE_URL} (${new Date().toLocaleString()})`);
    });
} else {
    const server = app.listen(process.env.NODE_PORT || 3000, () => {
        console.log(`Serving on http://localhost:${server.address().port} (${new Date().toLocaleString()})`);
    });
}