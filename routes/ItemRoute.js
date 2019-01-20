const ItemController = require('../controllers').Item;
const express = require('express');
const {adminMiddleware} = require('../middlewares');

let router = express.Router();

router.post("/", adminMiddleware, ItemController.createItem, async function (req, res) {
    res.status(201).json(req.item.getDetail());
});
router.post("/add", adminMiddleware, ItemController.addItemStock, async function (req, res) {
    res.json(req.item.getDetail());
});
router.post("/reduce", adminMiddleware, ItemController.reduceItemStock, async function (req, res) {
    res.json(req.item.getDetail());
});
router.get("/all", ItemController.getAllItem, async function (req, res) {
    res.json(req.items);
});

module.exports = router;
