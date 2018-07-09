const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const session = require('express-session');
const uniqid = require('uniqid')
// const secret = require('./secret.txt');

const app = express();
const router = express.Router;
const modules = require('./routes/modules');
// const api = require('./routes/api');
const hour = 3600000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(session({
  genid: function(req) {
    return uniqid() // use UUIDs for session IDs
  },
  // secret: secret.secret,
  secret: 'secpass'
}))

// app.use(app.router);
// routes.initialize(app);

// app.use('/api', api);
app.use('/modules', modules);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

module.exports = router;
