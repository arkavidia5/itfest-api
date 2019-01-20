const {Item, Tenant} = require('../models');
const AppError = require('../AppError');
const mongo = require('mongodb');

let createItem = async function (req, res, next) {
    try {
        let {name, price, tenant, stock} = req.body;
        if (await Tenant.Repository.fetchOne({name: tenant}) === null)
            return next(new AppError(400, 'tenant not found'));
        req.item = await Item.Repository.create(name, price, tenant, stock);
        next();
    } catch (e) {
        next(e);
    }
};

let getAllItem = async function (req, res, next) {
    let items = await Item.Repository.fetchAll();
    req.items = items.map((obj) => obj.getDetail());
    next();
};

let getItemByTenant = async function (req, res, next) {
    let tenant = req.query.name;
    req.items = await Item.Repository.fetch({tenant: `/${tenant}/`});
    next();
};

let addItemStock = async function (req, res, next) {
    let {item_id, addition} = req.body;
    if (!addition || addition <= 0) {
        return next(new AppError(400, 'wrong input for addition'));
    }
    let item = await Item.Repository.fetchOne({_id: new mongo.ObjectID(item_id)});
    if (!item) {
        return next(new AppError(400, 'item not found'));
    }
    item.stock += addition;
    item.max_stock += addition;
    await Item.Repository.updateStock(item);
    req.item = item;
    next();
};

let reduceItemStock = async function (req, res, next) {
    let {item_id, reduction} = req.body;
    if (!reduction) {
        return next(new AppError(400, 'wrong input'));
    }
    let item = await Item.Repository.fetchOne({_id: new mongo.ObjectID(item_id)});
    if (!item) {
        return next(new AppError(400, 'item not found'));
    }
    if (reduction > item.stock) {
        return next(new AppError(400, 'stock < reduction'));
    }
    item.stock -= reduction;
    item.max_stock -= reduction;
    await Item.Repository.updateStock(item);
    req.item = item;
    next();
};

module.exports = {createItem, getAllItem, getItemByTenant, addItemStock, reduceItemStock};
