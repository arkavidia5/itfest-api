const db = require('../database').getDB();
const AppError = require('../AppError');

class User {

    constructor(id, point) {
        this.id = id;
        this.point = point;
    }

    addPoint(value) {
        this.point += value;
    }

    reducePoint(value) {
        if (this.point >= value) {
            this.point -= value;
            return true;
        } else {
            return false;
        }
    }

    getDetail() {
        return {
            "id": this.id,
            "point": this.point
        };
    }
}

class UserRepository {

    static async create(id, point) {
        let user = new User(id, point);
        try {
            await db.collection('user').insertOne(user.getDetail());
        } catch (e) {
            throw new AppError(500, e.message);
        }
        return user;
    }

    static async createUsers(count) {
        let users = [];
        let usersDetail = [];
        for (let i = 0; i < count; i++) {
            let id = Math.floor(Math.random() * 9000000000) + 1000000000;
            let user = new User(id, 0);
            users.push(user);
            usersDetail.push(user.getDetail());
        }
        try {
            await db.collection('user').insertMany(usersDetail);
        } catch (e) {
            throw new AppError(500, e.message);
        }
        return true;
    }

    static async fetchOne(condition) {
        let docs = await db.collection('user').find(condition).toArray();
        if (docs.length === 0) return null;
        return new User(docs[0].id, docs[0].point);
    }

    static async fetchAll() {
        let docs = await db.collection('user').find().toArray();
        if (docs.length === 0) return [];
        let users = [];
        for (let doc of docs) {
            users.push(new User(doc.id, doc.point));
        }
        return users;
    }

}

module.exports = {
    Model: User,
    Repository: UserRepository
};
