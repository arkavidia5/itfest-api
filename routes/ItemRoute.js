const ItemController = require('../controllers').Item;
const express = require('express');
const {adminMiddleware} = require('../middlewares');

let router = express.Router();

router.post("/", adminMiddleware, ItemController.createItem);
router.get("/", ItemController.getAllItem);

module.exports = router;
