const jwt = require('jsonwebtoken');
const User = require('../models').User;

let createUser = async function(req, res, next) {
    try {
        let {count} = req.body;
        await User.Repository.createUsers(count);
        res.json('OK');
    } catch (e) {
        next(e);
    }
};

let login = async function (req, res, next) {
    let {id} = req.body;
    let user = await User.Repository.fetchOne({id});
    if (user) {
        let token = jwt.sign({'id': user.id, 'type': 'user'}, process.ENV.JWT_KEY);
        res.setHeader('authorization', `Bearer ${token}`);
        res.json('OK');
    } else {
        res.statusCode(401).json('Not authorized');
    }
};

let detail = async function (req, res, next) {
    let id =  parseInt(req.params.id);
    let user = await User.Repository.fetchOne({id});
    if (user) {
        res.json(user.getDetail());
    } else {
        res.json({});
    }
};

module.exports = {login, detail, createUser};
