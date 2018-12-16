require('dotenv').config();

const http = require('http');
const app = require('./server');


let server = http.createServer(app);
let port = process.env.PORT || 3030;
server.listen(port);
server.on('listening', onListening);

function onListening() {
    console.log(`server listening ${port}`)
}

