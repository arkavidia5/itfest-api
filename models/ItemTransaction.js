const database = require('../database');
const db = database.getDB();
const mongo = require('mongodb');
const AppError = require('../AppError');

class ItemTransaction {

    constructor(item, tenant, user_id, quantity, total_price, created_at = Date.now(), id = -1) {
        this.id = id;
        this.item = item;
        this.tenant = tenant;
        this.user_id = user_id;
        this.quantity = quantity;
        this.total_price = total_price;
        this.created_at = created_at;
    }

    setID(id) {
        this.id = id;
    }

    getDetail() {
        return {
            type: 'item_transaction',
            item: this.item,
            tenant: this.tenant,
            user_id: this.user_id,
            quantity: this.quantity,
            total_price: this.total_price,
            created_at: this.created_at
        }
    }
}

class ItemTransactionRepository {

    static async create(item, user, quantity, total_price) {
        const session = database.startSession();
        session.startTransaction();
        const opts = {session, returnOriginal: false};
        let itemTransaction = new ItemTransaction(item.name, item.tenant, user.id, quantity, total_price);
        try {
            let result = await db.collection('item_transaction')
                .insertOne(itemTransaction.getDetail(), opts);
            let insertedId = result.insertedId.toString();
            itemTransaction.setID(insertedId);
            await db.collection('user')
                .updateOne({id: user.id}, {$set: {point: user.point}}, opts);
            await db.collection('item')
                .updateOne({_id: new mongo.ObjectID(item.id)}, {$set: {stock: item.stock}}, opts);
            await session.commitTransaction();
            session.endSession();
        } catch (e) {
            await session.abortTransaction();
            session.endSession();
            throw new AppError(500, e.message);
        }
        return itemTransaction;
    }

    static async fetch(condition) {
        let docs = await db.collection('item_transaction').find(condition).toArray();
        if (docs.length === 0) return [];
        let txs = [];
        for (let doc of docs) {
            txs.push(new ItemTransaction(doc.item, doc.tenant, doc.user_id, doc.quantity, doc.total_price, doc.created_at, doc._id));
        }
        return txs;
    }

    static async fetchAll() {
        let docs = await db.collection('item_transaction').find().toArray();
        let txs = [];
        for (let doc of docs) {
            txs.push(new ItemTransaction(doc.item, doc.tenant, doc.user_id, doc.quantity, doc.total_price, doc.created_at, doc._id));
        }
        return txs;
    }

}

module.exports = {
    Model: ItemTransaction,
    Repository: ItemTransactionRepository
};
