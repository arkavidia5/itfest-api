const jwt = require('jsonwebtoken');
const Admin = require('../models').Admin;

let login = async function (req, res, next) {
    let {username, password} = req.body;
    try {
        let admin = await Admin.Repository.fetchOne({username});
        if (admin && await admin.verifyPassword(password)) {
            let token = jwt.sign({'id': admin.id, 'username': admin.username, 'type': 'admin'}, process.env.JWT_KEY);
            res.setHeader('authorization', `Bearer ${token}`);
            res.json('OK');
        } else {
            res.status(401).json('Not authorized');
        }
    } catch (e) {
        next(e);
    }
};

module.exports = {
    login
};
