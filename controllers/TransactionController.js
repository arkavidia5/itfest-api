const {PointTransaction, ItemTransaction, Tenant, User, Item} = require('../models');
const AppError = require('../AppError');
const mongo = require('mongodb');

let givePoint = async function (req, res, next) {
    try {
        let {tenant_name, user_id, point} = req.body;
        if (!point || point % 25 !== 0 || point > 250)
            return next(new AppError(400, 'wrong input for point'));
        let tenant = await Tenant.Repository.fetchOne({name: tenant_name});
        let user = await User.Repository.fetchOne({id: parseInt(user_id)});
        if (!user || !tenant)
            return next(new AppError(400, 'tenant or user not found'));
        if (!tenant.reducePoint(point))
            return next(new AppError(400, 'tenant\'s point not enough'));
        user.addPoint(point);
        req.pt = await PointTransaction.Repository.create(tenant, user, point);
        next();
    } catch (e) {
        next(e);
    }
};

let redeemItem = async function (req, res, next) {
    try {
        let {item_id, user_id, quantity} = req.body;
        let item = await Item.Repository.fetchOne({_id: new mongo.ObjectID(item_id)});
        let user = await User.Repository.fetchOne({id: parseInt(user_id)});
        if (!user || !item) {
	        return next(new AppError(400, 'item or user not found'));
        }
	    let totalPrice = item.buyItem(quantity);
	    if (!totalPrice)
            return next(new AppError(400, 'stock is less than quantity'));
        if (!user.reducePoint(totalPrice))
            return next(new AppError(400, `user ${user.id} doesn't have enough point`));
        req.it = await ItemTransaction.Repository.create(item, user, quantity, totalPrice);
        next();
    } catch (e) {
        next(e);
    }
};

let getTransactionsByUser = async function(req, res, next) {
    let user_id = parseInt(req.params.id);
    let pt = await PointTransaction.Repository.fetch({user_id});
    let it = await ItemTransaction.Repository.fetch({user_id});
    let transactions = pt.concat(it);
    transactions.sort((a, b) => b.created_at - a.created_at);
    req.txs = transactions.map((obj) => obj.getDetail());
    next();
};

let getAllTransaction = async function(req, res, next) {
    let pt = await PointTransaction.Repository.fetchAll();
    let it = await ItemTransaction.Repository.fetchAll();
    let transactions = pt.concat(it);
    transactions.sort((a, b) => b.created_at - a.created_at);
    req.txs = transactions.map((obj) => obj.getDetail());
    next();
};

module.exports = {givePoint, redeemItem, getTransactionsByUser, getAllTransaction};
