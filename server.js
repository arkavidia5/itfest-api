const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');


const routes = require('./routes');
const AppError = require('./AppError');

let server = express();

server.set('view engine', 'ejs');
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());
server.use(routes);
server.use(async function (err, req, res, next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json(err.message);
    } else {
        console.log(err);
        res.status(500).json(process.env.DEBUG ? err.message : 'Internal Server Error');
    }
});

server.get("/", async function (req, res) {
    res.send('OK');
});

module.exports = server;
