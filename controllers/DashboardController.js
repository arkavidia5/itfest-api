const Admin = require('../models').Admin;
const jwt = require('jsonwebtoken');

let login = async function (req, res, next) {
    let {username, password} = req.body;
    try {
        let admin = await Admin.Repository.fetchOne({username});
        if (admin && await admin.verifyPassword(password)) {
            res.validated = true;
            req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
            req.session.auth = jwt.sign({'id': admin.id, 'username': admin.username, 'type': 'admin'},
                process.env.JWT_KEY, {expiresIn: process.env.EXPIRES_IN});
        } else {
            res.validated = false;
        }
        next();
    } catch (e) {
        next(e);
    }
};

module.exports = {
    login
};
