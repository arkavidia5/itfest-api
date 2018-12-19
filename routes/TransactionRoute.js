const TransactionController = require('../controllers').Transaction;
const express = require('express');
const {tenantMiddleware, jsonMiddleware, adminMiddleware} = require('../middlewares');

let router = express.Router();

router.post("/point", jsonMiddleware, tenantMiddleware, TransactionController.givePoint);
router.post("/item", jsonMiddleware, adminMiddleware, TransactionController.redeemItem);
router.get("/user/:id", TransactionController.getTransactionsByUser);

module.exports = router;
