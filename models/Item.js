const db = require('../database').getDB();
const AppError = require('../AppError');
const mongo = require('mongodb');

class Item {

    constructor(name, price, tenant, stock, max_stock, id = -1) {
        this.name = name;
        this.price = price;
        this.tenant = tenant;
        this.stock = stock;
        this.max_stock = max_stock;
        this.id = id;
    }

    setID(id) {
        this.id = id;
    }

    buyItem(qty) {
        if (this.stock - qty < 0) {
            return false;
        } else {
            this.stock -= qty;
            return this.price * qty;
        }
    }

    getDetail() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            tenant: this.tenant,
            stock: this.stock,
            max_stock: this.max_stock
        }
    }

}

class ItemRepository {

    static async create(name, price, tenant, stock) {
        let docs = await db.collection('item').find({"name": name, "tenant": tenant}).toArray();
        if (docs.length > 0) {
            throw new AppError(400, `Item ${name} already created for ${tenant}`);
        }
        let item = new Item(name, price, tenant, stock, stock);
        try {
            let result = await db.collection('item').insertOne(item.getDetail());
            item.setID(result.insertId);
        } catch (e) {
            throw new AppError(500, e.message);
        }
        return item;
    }

    static async fetch(conditions) {
        let docs = await db.collection('item').find(conditions).toArray();
        if (docs.length === 0) return [];
        let items = [];
        for (let doc of docs) {
            items.push(new Item(doc.name, doc.price, doc.tenant, doc.stock, doc.max_stock, doc._id));
        }
        return items;
    }

    static async fetchOne(conditions) {
        let docs = await db.collection('item').find(conditions).toArray();
        if (docs.length === 0) return null;
        return new Item(docs[0].name, docs[0].price, docs[0].tenant, docs[0].stock, docs[0].max_stock, docs[0]._id);
    }

    static async fetchAll() {
        let docs = await db.collection('item').find().toArray();
        let items = [];
        for (let doc of docs) {
            items.push(new Item(doc.name, doc.price, doc.tenant, doc.stock, doc.max_stock, doc._id));
        }
        return items;
    }

    static async updateStock(item) {
        await db.collection('item')
            .updateOne({_id: new mongo.ObjectID(item.id)}, {$set: {stock: item.stock, max_stock: item.max_stock}});
    }
}

module.exports = {
    Model: Item,
    Repository: ItemRepository
};
