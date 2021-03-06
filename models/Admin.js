const bcrypt = require('bcrypt');
const db = require('../database').getDB();
const AppError = require('../AppError');

class Admin {

    constructor(username, password, id = -1) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    setId(id) {
        this.id = id;
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async verifyPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

}

class AdminRepository {

    static async create(username, password) {
        let hashedPassword = await Admin.hashPassword(password);
        let admin = new Admin(username, hashedPassword);
        try {
            let result = await db.collection('admin').insertOne({
                "username": admin.username,
                "password": admin.password
            });
            admin.setId(result.insertedId.toString());
        } catch (e) {
            throw new AppError(500, e.message);
        }
        return admin;
    }

    static async fetchOne(condition) {
        let docs = await db.collection('admin').find(condition).limit(1).toArray();
        if (docs.length === 0) return null;
        return new Admin(docs[0].username, docs[0].password, docs[0]._id);
    }

}

module.exports = {
    Model: Admin,
    Repository: AdminRepository
};
