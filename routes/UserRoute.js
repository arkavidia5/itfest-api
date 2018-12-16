const controller = require('../controllers').User;
const express = require('express');

const router = express.Router();

const jsonMiddleware = async (req, res, next) => {
    if (req.headers['content-type'].indexOf('application/json') !== 0)
        return res.statusCode(400).json('Content-type must be application/json');
    next();
};

router.post('/login', jsonMiddleware, controller.login);
router.post('/', jsonMiddleware, controller.createUser);
router.get('/:id', controller.detail);

module.exports = router;
