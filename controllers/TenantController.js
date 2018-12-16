const jwt = require('jsonwebtoken');
const Tenant = require('../models').Tenant;

let createTenant = async function(req, res, next) {
    try {
        let {name, detail_name, password, point} = req.body;
        await Tenant.Repository.create(name, detail_name, password, point);
        res.json('OK');
    } catch (e) {
        next(e);
    }
};

let login = async function (req, res, next) {
    let {username, password} = body.id;
    let tenant = await Tenant.Repository.fetchOne({username});
    if (tenant && tenant.verifyPassword(password)) {
        let token = jwt.sign({'id': tenant.id, 'type': 'tenant'}, process.ENV.JWT_KEY);
        res.setHeader('authorization', `Bearer ${token}`);
        res.json('OK');
    } else {
        res.statusCode(401).json('not authorized');
    }
};

let detail = async function (req, res, next) {
    let name = req.params.name;
    let tenant = await Tenant.Repository.fetchOne({name});
    if (tenant) {
        res.json(tenant.getDetail());
    } else {
        res.json({});
    }
};

module.exports = {login, detail, createTenant};
