const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = process.env.DB_URL;
// Database name
const dbName = process.env.NODE_ENV === 'prod' ? process.env.DB_NAME : process.env.DB_TEST_NAME;
// Client
const client = new MongoClient(url, {useNewUrlParser: true});

let db;

async function initialize() {
    await client.connect();
    db = client.db(dbName);
    return db;
}

function getDB() {
    return db ? db : null;
}


function startSession() {
    return client.startSession();
}

module.exports = {
    'initialize': initialize,
    'getDB': getDB,
    'startSession': startSession
};

