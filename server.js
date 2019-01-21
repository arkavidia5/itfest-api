const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const routes = require('./routes');
const AppError = require('./AppError');
const cors = require('cors');

let server = express();

let sessionConfig = {
    secret: process.env.SESSION_KEY,
    store: new FileStore(),
    resave: false,
    saveUninitialized: true,
    cookie: {}
};

if (process.env.NODE_ENV === 'prod') {
    server.set('trust proxy', 1);
    sessionConfig.cookie.secure = true;
}

// Server config
server.use(cors());
server.set('view engine', 'ejs');
server.use('/static', express.static('public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.urlencoded({extended: false}));
// server.use(cookieParser());
server.use(logger("dev"));
server.use(session(sessionConfig));

// Our Routing
server.use(routes);
server.use(async function (err, req, res, next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json(err.message);
    } else {
        console.log(err);
        res.status(500).json(process.env.DEBUG ? err.message : "Internal Server Error");
    }
});
// To check if server is ok
server.get("/", async function (req, res) {
    res.send("OK");
});

module.exports = server;
