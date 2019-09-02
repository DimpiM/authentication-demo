const express = require('express');
const fs = require('fs');
const cookieSession = require('cookie-session');
const cookieParser  = require('cookie-parser');
const crypto        = require('crypto');
//const https = require('https');
//const http2 = require('http2'); // is not working with express v4... waiting for v5
const spdy = require('spdy'); // use this till http2 package is working with express
const compression = require('compression')

const routes = require('./server/routes.js');

const app = express();

app.use(compression());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
/* ----- session ----- */
app.use(cookieSession({
  name: 'session',
  keys: [crypto.randomBytes(32).toString('hex')],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(cookieParser())

app.use('/app/styles', express.static(__dirname + '/app/styles'));
app.use('/app/scripts', express.static(__dirname + '/app/scripts'));
app.use('/favicon.ico', express.static(__dirname + '/app/styles/images/favicon.ico'));

app.use('/', routes);

spdy.createServer({
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.crt')
}, app)
.listen(8080, function () {
  console.log('Example is running on port 8080! Go to https://localhost:8080/')
});