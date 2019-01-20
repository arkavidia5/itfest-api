const TransactionController = require('../controllers').Transaction;
const express = require('express');
const {tenantMiddleware, jsonMiddleware, adminMiddleware} = require('../middlewares');

let router = express.Router();

router.post("/point",
    jsonMiddleware,
    tenantMiddleware,
    TransactionController.givePoint,
    async function (req, res) {
        res.status(201).json(req.pt.getDetail());
    });
router.post("/item",
    jsonMiddleware,
    adminMiddleware,
    TransactionController.redeemItem,
    async function (req, res) {
        res.status(201).json(req.it.getDetail());
    });
router.get("/user/:id", TransactionController.getTransactionsByUser,
    async function (req, res) {
        res.json(req.txs);
    });
router.get("/all", TransactionController.getAllTransaction,
    async function (req, res) {
        res.json(req.txs);
    });
module.exports = router;
