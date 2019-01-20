const jwt = require('jsonwebtoken');
const Tenant = require('../models').Tenant;

let createTenant = async function(req, res, next) {
    try {
        let {name, detail_name, password, point} = req.body;
        await Tenant.Repository.create(name, detail_name, password, point);
        next();
    } catch (e) {
        next(e);
    }
};

let login = async function (req, res, next) {
    let {name, password} = req.body;
    try {
        let tenant = await Tenant.Repository.fetchOne({name});
        if (tenant && await tenant.verifyPassword(password)) {
            req.token = jwt.sign({'id': tenant.id, 'type': 'tenant'}, process.env.JWT_KEY);
        }
        next();
    } catch (e) {
        next(e);
    }

};

let detail = async function (req, res, next) {
    let name = req.params.name;
    let tenant = await Tenant.Repository.fetchOne({name});
    if (tenant) {
        req.tenant = tenant.getDetail();
    } else {
        req.tenant = {};
    }
    next();
};

let getAllTenant = async function (req, res, next) {
    let tenants = await Tenant.Repository.fetchAll();
    req.tenants = tenants.map(obj => obj.getDetail());
    next();
};

module.exports = {login, detail, createTenant, getAllTenant};
