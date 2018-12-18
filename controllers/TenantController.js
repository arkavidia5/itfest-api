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
    let {name, password} = req.body;
    try {
        let tenant = await Tenant.Repository.fetchOne({name});
        if (tenant && await tenant.verifyPassword(password)) {
            let token = jwt.sign({'id': tenant.id, 'type': 'tenant'}, process.env.JWT_KEY);
            res.setHeader('authorization', `Bearer ${token}`);
            res.json('OK');
        } else {
            res.status(401).json('not authorized');
        }
    } catch (e) {
        next(e);
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
