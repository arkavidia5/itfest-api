const jwt = require('jsonwebtoken');
let mongo = require('mongodb');

const checkAuthHeader = function(req) {
    if (!req.headers['authorization'])
        return false;
    let auth = req.headers['authorization'];
    let token = auth.split(" ")[1];
    return jwt.verify(token, process.env.JWT_KEY);
};

const adminMiddleware = async function(req, res, next) {
    let payload = checkAuthHeader(req);
    if (!payload || payload.type !== 'admin') {
        return res.status(401).json('not authorized');
    }
    let Admin = require('./models').Admin.Repository;
    let admin = await Admin.fetchOne({_id: new mongo.ObjectID(payload.id)});
    if (admin === null) {
        return res.status(401).json('not authorized');
    }
    req.admin = admin;
    next();
};

const tenantMiddleware = async (req, res, next) => {
    let payload = checkAuthHeader(req);
    if (!payload || payload.type !== 'tenant') {
        return res.status(401).json('not authorized');
    }
    let Tenant = require('./models').Tenant.Repository;
    let tenant = await Tenant.fetchOne({_id: new mongo.ObjectID(payload.id)});
    if (tenant === null) {
        return res.status(401).json('not authorized');
    }
    req.tenant = tenant;
    next();
};

const userMiddleware = async (req, res, next) => {
    let payload = checkAuthHeader(req);
    if (!payload || payload.type !== 'user') {
        return res.status(401).json('not authorized');
    }
    let User = require('./models').User.Repository;
    let user = await User.fetchOne({id: payload.id});
    if (user === null) {
        return res.status(401).json('not authorized');
    }
    req.user = user;
    next();
};

const jsonMiddleware = async (req, res, next) => {
    if (req.headers['content-type'].indexOf('application/json') !== 0)
        return res.statusCode(400).json('Content-type must be application/json');
    next();
};

module.exports = {adminMiddleware, jsonMiddleware, tenantMiddleware, userMiddleware};
