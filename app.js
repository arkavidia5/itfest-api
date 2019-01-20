#!/usr/bin/env nodejs
require('dotenv').config();

const initializeDB = require('./database').initialize;

// Must connect to mongo first
initializeDB()
    .then((db) => {
        console.log('Mongo connected');

        const http = require('http');
        const app = require('./server');

        let server = http.createServer(app);
        let port = process.env.PORT || 3030;

        server.listen(port);
        server.on('listening', onListening);

        function onListening() {
            console.log(`server listening ${port}`)
        }
    })
    .catch((e) => {
        console.log(e.message);
        process.exit(1);
    });

