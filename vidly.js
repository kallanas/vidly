const winston = require('winston');
const express = require('express');
const app = express();


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);

const port = process.env.PORT || 7000;
const server = app.listen(7000, () => winston.info(`listening on port ${port}..`));

module.exports = server;