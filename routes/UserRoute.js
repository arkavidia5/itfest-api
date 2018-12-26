const controller = require('../controllers').User;
const express = require('express');
const {adminMiddleware, jsonMiddleware} = require('../middlewares');

const router = express.Router();

router.post('/login', jsonMiddleware, controller.login);
router.post('/', jsonMiddleware, adminMiddleware, controller.createUser);
router.get('/:id', controller.detail);
router.get('/all', controller.fetchAllUser);

module.exports = router;
