const db = require('../database').getDB();
const bcrypt = require('bcrypt');
const AppError = require('../AppError');

class Tenant {

    constructor(name, detail_name, point, password, id = -1) {
        this.id = id;
        this.name = name;
        this.detail_name = detail_name;
        this.password = password;
        this.point = point;
    }

    setID(id) {
        this.id = id;
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
            name: this.name,
            detail_name: this.detail_name,
            point: this.point
        }
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async verifyPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

}

class TenantRepository {

    static async create(name, detail_name, password, point) {
        let hashedPassword = await Tenant.hashPassword(password);
        let tenant = new Tenant(name, detail_name, point, hashedPassword);
        let docs = await db.collection('tenant').find({name}).toArray();
        if (docs.length > 0)
            throw new AppError(400, `${tenant.name} already created`);
        try {
            let result = await db.collection('tenant').insertOne({name: tenant.name, detail_name: tenant.detail_name, password: tenant.password, point: tenant.point});
            tenant.setID(result.insertedId.toString());
        } catch (e) {
            throw new AppError(500, e.message);
        }
        return tenant;
    }

    static async fetchOne(condition) {
        let docs = await db.collection('tenant').find(condition).toArray();
        if (docs.length === 0) return null;
        return new Tenant(docs[0].name, docs[0].detail_name, docs[0].point, docs[0].password, docs[0]._id);
    }

    static async fetchAll() {
        let docs = await db.collection('tenant').find().toArray();
        let tenants = [];
        for (let doc of docs) {
            tenants.push(new Tenant(doc.name, doc.detail_name, doc.point, doc.password, doc._id));
        }
        return tenants;
    }

}

module.exports = {
    Model: Tenant,
    Repository: TenantRepository
};
