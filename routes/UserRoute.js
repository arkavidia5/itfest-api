const controller = require('../controllers').User;
const express = require('express');
const {adminMiddleware, jsonMiddleware} = require('../middlewares');

const router = express.Router();

router.post('/login', jsonMiddleware, controller.login);
router.post('/', jsonMiddleware, adminMiddleware, controller.createUser);
router.get('/all', controller.fetchAllUser);
router.get('/:id', controller.detail);

module.exports = router;
