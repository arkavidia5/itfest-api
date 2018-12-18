const TransactionController = require('../controllers').Transaction;
const express = require('express');
const {tenantMiddleware, adminMiddleware} = require('../middlewares');

let router = express.Router();

router.post("/point", tenantMiddleware, TransactionController.givePoint);
router.post("/item", adminMiddleware, TransactionController.redeemItem);
router.get("/user/:id", TransactionController.getTransactionsByUser);

module.exports = router;
