const controller = require('../controllers').User;
const express = require('express');
const {adminMiddleware, jsonMiddleware} = require('../middlewares');

const router = express.Router();

router.post('/login', jsonMiddleware, controller.login, async function (req, res) {
    if (req.token) {
        res.setHeader('authorization', `Bearer ${req.token}`);
        res.json('OK');
    } else {
        res.statusCode(401).json('Failed to login');
    }
});
router.post('/', jsonMiddleware, adminMiddleware, controller.createUser, async function (req, res) {
    res.json('OK');
});
router.get('/all', controller.fetchAllUser, async function (req, res) {
    res.json(req.users);
});
router.get('/:id', controller.detail, async function (req, res) {
    res.json(req.user);
});

module.exports = router;
