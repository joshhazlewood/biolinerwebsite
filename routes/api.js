const express = require('express');
const router = express.Router();
const modules = require('./modules');
const app = express();

app.use('/modules', modules);

module.exports = router;
