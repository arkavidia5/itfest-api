const jwt = require('jsonwebtoken');
const User = require('../models').User;

let createUser = async function(req, res, next) {
    try {
        let {count} = req.body;
        await User.Repository.createUsers(count);
        next();
    } catch (e) {
        next(e);
    }
};

let login = async function (req, res, next) {
    let {id} = req.body;
    let user = await User.Repository.fetchOne({id});
    if (user) {
        req.token = jwt.sign({'id': user.id, 'type': 'user'}, process.env.JWT_KEY);
    }
    next();
};

let detail = async function (req, res, next) {
    let id =  parseInt(req.params.id);
    let user = await User.Repository.fetchOne({id});
    if (user) {
        req.user = user.getDetail();
    } else {
        req.user = {};
    }
    next();
};

let fetchAllUser = async function (req, res, next) {
    let users = await User.Repository.fetchAll();
    req.users = users.map(obj => obj.getDetail());
    next();
};

module.exports = {login, detail, createUser, fetchAllUser};
