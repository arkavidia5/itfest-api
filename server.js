const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const initialize = require('./database').initialize;
const routes = require('./routes');

// Must connect to mongo first
initialize()
    .then((db) => console.log('Mongo connected'))
    .catch((e) => {
        console.log(e.message);
        process.exit(1);
    });

let server = express();

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());
server.use(routes);

server.get("/", async function (req, res) {
    res.send('OK');
});

module.exports = server;
