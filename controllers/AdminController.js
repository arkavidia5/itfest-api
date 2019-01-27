const jwt = require('jsonwebtoken');
const Admin = require('../models').Admin;

let login = async function (req, res, next) {
    let {username, password} = req.body;
    try {
        let admin = await Admin.Repository.fetchOne({username});
        if (admin && await admin.verifyPassword(password)) {
            req.token = jwt.sign({'id': admin.id, 'username': admin.username, 'type': 'admin'},
                process.env.JWT_KEY, {expiresIn: process.env.EXPIRES_IN});
            req.validated = true;
        } else {
            req.validated = false;
        }
        next();
    } catch (e) {
        next(e);
    }
};

module.exports = {
    login
};
