require('dotenv').config();

let database = require('./database');

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

database.initialize().then((db) => {
    seedAdmin(db)
        .then((res) => {
            console.log(res);
            process.exit(0);
        })
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });
});


