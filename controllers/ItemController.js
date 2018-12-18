const {Item, Tenant} = require('../models');
const AppError = require('../AppError');

let createItem = async function (req, res, next) {
    try {
        let {name, price, tenant, stock} = req.body;
        if (await Tenant.Repository.fetchOne({name: tenant}) === null)
            throw new AppError(400, 'tenant not found');
        let item = await Item.Repository.create(name, price, tenant, stock);
        res.json(item.getDetail());
    } catch (e) {
        next(e);
    }
};

let getAllItem = async function (req, res, next) {
    let items = Item.Repository.fetchAll();
    return res.json(items);
};

let getItemByTenant = async function (req, res, next) {
    let tenant = req.query.name;
    let items = Item.Repository.fetch({tenant: `/${tenant}/`});
    return res.json(items);
};

module.exports = {createItem, getAllItem, getItemByTenant};
