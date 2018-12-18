require('dotenv').config();

const database = require('./database');

async function seedAdmin(db) {
    let Admin = require('./models').Admin;
    let repo = Admin.Repository;
    let admin = await repo.create('admin', 'admin');
    let result = await db.collection('admin').createIndex({"username": 1}, {unique: true});
    admin = await repo.fetchOne('admin');
    return {
        admin, result
    };
}

async function indexTenant(db) {
    return await db.collection('tenant').createIndex({"name": 1}, {unique: true});
}

async function indexUser(db) {
    return await db.collection('user').createIndex({"id": 1}, {unique: true});
}

async function indexItem(db) {
    return await db.collection('item').createIndex({"name": 1, "tenant": 1}, {unique: true});
}

try {
    database.initialize().then(db => {
        // seedAdmin(db).then(r => console.log(r));
        indexTenant(db).then((r) => console.log(r));
        indexItem(db).then(r => console.log(r));
        indexUser(db).then(r => console.log(r));
    });
} catch (e) {
    console.log(e.message);
    process.exit(1);
}

