const database = require('../database');
const db = database.getDB();
const AppError = require('../AppError');

class PointTransaction {

    constructor(tenant, user_id, point, created_at = Date.now(), id = -1) {
        this.id = id;
        this.tenant = tenant;
        this.user_id = user_id;
        this.point = point;
        this.created_at = created_at;
    }

    setID(id) {
        this.id = id;
    }

    getDetail() {
        return {
            type: 'point_transaction',
            tenant: this.tenant,
            user_id: this.user_id,
            point: this.point,
            created_at: this.created_at
        }
    }
}

class PointTransactionRepository {

    static async create(tenant, user, point) {
        const session = database.startSession();
        session.startTransaction();
        const opts = {session, returnOriginal: false};
        let pointTransaction = new PointTransaction(tenant.name, user.id, point);
        try {
            let result = await db.collection('point_transaction')
                .insertOne(pointTransaction.getDetail(), opts);
            pointTransaction.setID(result.insertId);
            await db.collection('tenant')
                .updateOne({_id: tenant.id}, {$set: {point: tenant.point}}, opts);
            await db.collection('user')
                .updateOne({id: user.id}, {$set: {point: user.point}}, opts);
            await session.commitTransaction();
            session.endSession();
        } catch (e) {
            await session.abortTransaction();
            session.endSession();
            throw new AppError(500, e.message);
        }
        return pointTransaction;
    }

    static async fetch(condition) {
        let docs = await db.collection('point_transaction').find(condition).toArray();
        if (docs.length === 0) return [];
        let txs = [];
        for (let doc of docs) {
            txs.push(new PointTransaction(doc.tenant, doc.user_id, doc.point, doc.created_at, doc._id));
        }
        return txs;
    }

}

module.exports = {
    Model: PointTransaction,
    Repository: PointTransactionRepository
};
